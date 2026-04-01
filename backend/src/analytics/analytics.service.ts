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

    async getAssetAnalytics(userId: number): Promise<{
        total: number;
        withVulns: number;
        byStatus: { status: string; count: number }[];
        byCriticality: {
            criticality: 'none' | 'low' | 'medium' | 'high' | 'critical';
            count: number;
        }[];
    }> {
        const qb = this.assetRepo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.vulnerabilities', 'v')
            .where('a.userId = :userId', { userId });

        const total = await qb.getCount();

        const withVulns = await qb
            .clone()
            .andWhere('v.id IS NOT NULL')
            .select('COUNT(DISTINCT a.id)', 'count')
            .getRawOne();

        const raw = await this.assetRepo
            .createQueryBuilder('a')
            .leftJoin('a.scans', 's')
            .where('a.userId = :userId', { userId })
            .select('a.id', 'id')
            .addSelect(`
        CASE 
            WHEN COUNT(s.id) > 0 THEN 'Онлайн'
            ELSE 'Оффлайн'
        END
    `, 'status')
            .groupBy('a.id')
            .getRawMany();

        const byStatusMap = raw.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const byStatus = Object.entries(byStatusMap).map(([status, count]) => ({
            status,
            count,
        }));

        const criticalityOrder = { low: 0, medium: 1, high: 2, critical: 3 };

        const assetsWithVulns = await qb.getMany();

        const assetCriticality = assetsWithVulns.reduce((acc, asset) => {
            const maxSeverity = asset.vulnerabilities?.reduce((max, v) => {
                return criticalityOrder[v.severity] > criticalityOrder[max] ? v.severity : max;
            }, 'low') || 'none';

            acc[asset.id] = maxSeverity;
            return acc;
        }, {} as Record<number, string>);

        const criticalityLevels: Array<'none' | 'low' | 'medium' | 'high' | 'critical'> = [
            'none',
            'low',
            'medium',
            'high',
            'critical',
        ];

        const byCriticality = criticalityLevels.map((level) => ({
            criticality: level,
            count: 0,
        }));

        assetsWithVulns.forEach((asset) => {
            const criticality = assetCriticality[asset.id] || 'none';
            const existingIndex = byCriticality.findIndex((i) => i.criticality === criticality);
            if (existingIndex !== -1) {
                byCriticality[existingIndex].count += 1;
            }
        });

        return {
            total,
            withVulns: Number(withVulns?.count || 0),
            byStatus: byStatus.map((r) => ({
                status: r.status,
                count: Number(r.count),
            })),
            byCriticality,
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