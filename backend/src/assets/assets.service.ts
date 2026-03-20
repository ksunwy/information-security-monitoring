import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private repo: Repository<Asset>) { }

  async create(dto: { ip: string; name: string; description?: string }): Promise<Asset> {
    return this.repo.save(dto);
  }

  async findAll(): Promise<any[]> {
    const assets = await this.repo.find({ relations: ['scans', 'vulnerabilities'] });

    return assets.map((asset) => {
      const criticalityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      let maxCriticality = 'low';

      if (asset.vulnerabilities?.length) {
        maxCriticality = asset.vulnerabilities.reduce((max: string, v: any) => {
          return criticalityOrder[v.criticality] > criticalityOrder[max] ? v.criticality : max;
        }, 'low');
      }

      const lastScan = asset.scans?.[0]?.scannedAt
        ? new Date(asset.scans[0].scannedAt).toLocaleString()
        : 'Никогда';
      const status = asset.scans?.length ? 'Онлайн' : 'Оффлайн';

      return {
        ...asset,
        criticality: maxCriticality,
        status,
        lastScan,
        group: 'Веб-серверы',
        owner: 'Админ',
      };
    });
  }

  async findOne(id: number): Promise<Asset> {
    return this.repo.findOne({ where: { id }, relations: ['scans', 'vulnerabilities'] });
  }

  async update(id: number, dto: Partial<Asset>): Promise<Asset> {
    return this.repo.save({ id, ...dto });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findRecent(limit = 10): Promise<Asset[]> {
    return this.repo.find({
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['scans', 'vulnerabilities'],
    });
  }
}