import { Injectable } from '@nestjs/common';
import { VulnerabilitiesService } from '../vulnerabilities/vulnerabilities.service';
import { AssetsService } from '../assets/assets.service';
import { ScansService } from '../scans/scans.service';

@Injectable()
export class DashboardsService {
  constructor(
    private vulnsService: VulnerabilitiesService,
    private assetsService: AssetsService,
    private scansService: ScansService,
  ) { }

  async vulnDistribution(): Promise<any> {
    const allVulns = await this.vulnsService.findAll();
    const dist = {
      low: 0, medium: 0, high: 0, critical: 0,
    };
    allVulns.forEach((v) => dist[v.severity]++);
    return dist;
  }

  async assetStats(): Promise<any> {
    const assets = await this.assetsService.findAll();
    return {
      total: assets.length,
      withVulns: assets.filter((a) => a.vulnerabilities.length > 0).length,
    };
  }

  async vulnDynamics(): Promise<any> {
    const vulns = await this.vulnsService.findAll();

    const map: Record<string, number> = {};

    vulns.forEach((v) => {
      const date = new Date(v.detectedAt).toISOString().split('T')[0];

      map[date] = (map[date] || 0) + 1;
    });

    const result = Object.entries(map)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  async securityTrends(): Promise<any> {
    const scans = await this.scansService.findAll();

    const map: Record<string, number> = {};

    scans.forEach((s) => {
      const date = new Date(s.scannedAt).toISOString().split('T')[0];

      map[date] = (map[date] || 0) + (s.webVulnerabilitiesCount || 0);
    });

    return Object.entries(map).map(([date, vulns]) => ({
      date,
      vulns,
    }));
  }

  async vulnDynamicsByUser(userId: string): Promise<{ date: string; count: number }[]> {
    const vulns = await this.vulnsService.findByUser(userId);

    const map: Record<string, number> = {};

    vulns.forEach((v) => {
      const date = new Date(v.detectedAt).toISOString().split('T')[0];
      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}