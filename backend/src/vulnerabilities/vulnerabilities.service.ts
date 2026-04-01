import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Vulnerability } from './vulnerability.entity';
import { Scan } from '../scans/scan.entity';

@Injectable()
export class VulnerabilitiesService {
  constructor(
    @InjectRepository(Vulnerability) private repo: Repository<Vulnerability>,
    private httpService: HttpService,
  ) { }

  async matchAndAssess(scan: Scan): Promise<Vulnerability[]> {
    const vulns: Vulnerability[] = [];

    for (const port of scan.ports) {
      const service = port.service;
      const version = port.version;

      const response = await firstValueFrom(
        this.httpService.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${service}+${version}`),
      );
      const cves = response.data.vulnerabilities || [];

      for (const cve of cves) {
        const cveId = cve.cve.id;
        const description = cve.cve.descriptions[0].value;
        const cvssScore = cve.cve.metrics.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
        const criticality = this.determineCriticality(cvssScore);

        const vuln = await this.repo.save({
          asset: scan.asset,
          cveId,
          description,
          cvssScore,
          criticality,
        });
        vulns.push(vuln);
      }
    }

    return vulns;
  }

  private determineCriticality(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 9) return 'critical';
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  async findByAsset(assetId: number): Promise<Vulnerability[]> {
    return this.repo.find({ where: { asset: { id: assetId } } });
  }

  async markFixed(id: number): Promise<Vulnerability> {
    return this.repo.save({ id, fixed: true });
  }

  async findAllWithAsset(): Promise<Vulnerability[]> {
    return this.repo.find({
      relations: ['asset'],
      order: { detectedAt: 'DESC' },
    });
  }

  async findRecent(limit = 100): Promise<Vulnerability[]> {
    return this.repo.find({
      take: limit,
      order: { detectedAt: 'DESC' },
    });
  }

  async findAll(options: { limit?: number; orderBy?: string } = {}): Promise<Vulnerability[]> {
    const { limit, orderBy } = options;

    const query = this.repo.createQueryBuilder('vuln');

    if (limit) {
      query.take(limit);
    }

    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      const dir = direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query.orderBy(`vuln.${field || 'detectedAt'}`, dir);
    } else {
      query.orderBy('vuln.detectedAt', 'DESC');
    }

    return query.getMany();
  }
  async createVulnerabilityFromCve(dto: {
    assetId: number;
    cveId: string;
    description: string;
    cvssScore: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    fixed: boolean;
  }): Promise<Vulnerability> {
    const vuln = this.repo.create({
      asset: { id: dto.assetId },
      cveId: dto.cveId,
      description: dto.description,
      cvssScore: dto.cvssScore,
      severity: dto.severity,
      fixed: dto.fixed,
    });

    return this.repo.save(vuln);
  }


  async findByUser(userId: string): Promise<Vulnerability[]> {
    return this.repo
      .createQueryBuilder('vuln')
      .innerJoinAndSelect('vuln.asset', 'asset')
      .where('asset.userId = :userId', { userId })
      .getMany();
  }
}