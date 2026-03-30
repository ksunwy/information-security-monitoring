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

    async getVulnAnalytics(userId: number): Promise<any> {
        const baseQb = this.vulnRepo
            .createQueryBuilder('v')
            .leftJoin('v.asset', 'a')
            .where('a.userId = :userId', { userId });

        const total = await baseQb.getCount();

        const bySeverity = await baseQb
            .clone()
            .select('COALESCE(v.severity, \'unknown\')', 'severity')
            .addSelect('COUNT(*)', 'count')
            .groupBy('v.severity')
            .getRawMany();

        const byStatus = await baseQb
            .clone()
            .select('v.fixed', 'fixed')
            .addSelect('COUNT(*)', 'count')
            .groupBy('v.fixed')
            .getRawMany();

        const topCve = await baseQb
            .clone()
            .select('COALESCE(v.cveId, \'NO-CVE\')', 'cveId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('v.cveId')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();

        const recent = await baseQb
            .clone()
            .orderBy('v.detectedAt', 'DESC')
            .take(5)
            .getMany();

        return {
            total,
            bySeverity: bySeverity.map(r => ({
                severity: r.severity,
                count: Number(r.count),
            })),
            byStatus: byStatus.map(r => ({
                fixed: Boolean(r.fixed),
                count: Number(r.count),
            })),
            topCve: topCve.map(r => ({
                cveId: r.cveId,
                count: Number(r.count),
            })),
            recent,
        };
    }

    async getAssetAnalytics(userId: number): Promise<any> {
        const qb = this.assetRepo
            .createQueryBuilder('a')
            .leftJoin('a.vulnerabilities', 'v')
            .where('a.userId = :userId', { userId });

        const total = await qb.getCount();

        const withVulns = await qb
            .clone()
            .andWhere('v.id IS NOT NULL')
            .select('COUNT(DISTINCT a.id)', 'count')
            .getRawOne();

        const byStatus = await qb
            .clone()
            .select('COALESCE(a.status, \'unknown\')', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('a.status')
            .getRawMany();

        const byCriticality = await qb
            .clone()
            .select('COALESCE(a.criticality, \'none\')', 'criticality')
            .addSelect('COUNT(*)', 'count')
            .groupBy('a.criticality')
            .getRawMany();

        return {
            total,
            withVulns: Number(withVulns?.count || 0),
            byStatus: byStatus.map(r => ({
                status: r.status,
                count: Number(r.count),
            })),
            byCriticality: byCriticality.map(r => ({
                criticality: r.criticality,
                count: Number(r.count),
            })),
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
        const qb = this.reportRepo
            .createQueryBuilder('r')
            .leftJoin('r.user', 'u')
            .leftJoin('r.asset', 'a')
            .where('u.id = :userId', { userId });

        const total = await qb.getCount();

        const byType = await qb
            .clone()
            .select('r.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('r.type')
            .getRawMany();

        const byStatus = await qb
            .clone()
            .select('r.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('r.status')
            .getRawMany();

        const recent = await qb
            .clone()
            .orderBy('r.createdAt', 'DESC')
            .take(10)
            .getMany();

        return {
            total,
            byType: byType.map(r => ({
                type: r.type,
                count: Number(r.count),
            })),
            byStatus: byStatus.map(r => ({
                status: r.status,
                count: Number(r.count),
            })),
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