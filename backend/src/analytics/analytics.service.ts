import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vulnerability } from '../vulnerabilities/vulnerability.entity';
import { Asset } from '../assets/asset.entity';
import { Report } from '../reports/report.entity';
import { CveService } from '../cve/cve.service';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Vulnerability) private vulnRepo: Repository<Vulnerability>,
        @InjectRepository(Asset) private assetRepo: Repository<Asset>,
        @InjectRepository(Report) private reportRepo: Repository<Report>,
        private cveService: CveService,
    ) { }

    async getVulnAnalytics(userId?: number): Promise<any> {
        const qb = this.vulnRepo
        .createQueryBuilder('v')
        .innerJoin('v.asset', 'a')
        .where('a.userId = :userId', { userId });

        const total = await qb.getCount();

        const bySeverity = await qb
            .clone()
            .select('v.severity, COUNT(*) as count')
            .groupBy('v.severity')
            .orderBy('count', 'DESC')
            .getRawMany();

        const byStatus = await qb
            .clone()
            .select('v.fixed, COUNT(*) as count')
            .groupBy('v.fixed')
            .getRawMany();

        const topCve = await qb
            .clone()
            .select('v.cveId, COUNT(*) as count')
            .groupBy('v.cveId')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();

        const recent = await qb
            .clone()
            .orderBy('v.detectedAt', 'DESC')
            .take(5)
            .getMany();

        return {
            total,
            bySeverity: bySeverity.map(r => ({ severity: r.severity || 'unknown', count: Number(r.count) })),
            byStatus: byStatus.map(r => ({ fixed: r.fixed === 'true', count: Number(r.count) })),
            topCve: topCve.map(r => ({ cveId: r.cveId, count: Number(r.count) })),
            recent,
        };
    }

    async getAssetAnalytics(userId?: number): Promise<any> {
        const qb = this.assetRepo
        .createQueryBuilder('a')
        .where('a.userId = :userId', { userId });

        const total = await qb.getCount();

        const withVulns = await qb
            .clone()
            .innerJoin('a.vulnerabilities', 'v')
            .select('COUNT(DISTINCT a.id) as count')
            .getRawOne();

        const byStatus = await qb
            .clone()
            .select('a.status, COUNT(*) as count')
            .groupBy('a.status')
            .getRawMany();

        const byCriticality = await qb
            .clone()
            .select('a.criticality, COUNT(*) as count')
            .groupBy('a.criticality')
            .getRawMany();

        return {
            total,
            withVulns: Number(withVulns?.count || 0),
            byStatus: byStatus.map(r => ({ status: r.status || 'unknown', count: Number(r.count) })),
            byCriticality: byCriticality.map(r => ({ criticality: r.criticality || 'none', count: Number(r.count) })),
        };
    }

    async getIbTrends(): Promise<any> {
        const trends = await this.cveService.getCveList('security vulnerability exploit 2025', 20, 0);

        return {
            latest: trends?.vulnerabilities?.slice(0, 10) || [],
            totalFound: trends?.totalResults || 0,
            timestamp: trends?.timestamp,
        };
    }

    async getReportAnalytics(userId: number): Promise<any> {
        const total = await this.reportRepo.count({ where: { user: { id: userId } } });

        const byType = await this.reportRepo
            .createQueryBuilder('r')
            .where('r.userId = :userId', { userId })
            .select('r.type, COUNT(*) as count')
            .groupBy('r.type')
            .getRawMany();

        const byStatus = await this.reportRepo
            .createQueryBuilder('r')
            .where('r.userId = :userId', { userId })
            .select('r.status, COUNT(*) as count')
            .groupBy('r.status')
            .getRawMany();

        const recent = await this.reportRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: 10,
            relations: ['asset'],
        });

        return {
            total,
            byType: byType.map(r => ({ type: r.type, count: Number(r.count) })),
            byStatus: byStatus.map(r => ({ status: r.status, count: Number(r.count) })),
            recent: recent.map(r => ({
                id: r.id,
                title: r.title,
                type: r.type,
                status: r.status,
                createdAt: r.createdAt,
                assetName: r.asset?.name || r.asset?.ip || 'Без актива',
            })),
        };
    }
}