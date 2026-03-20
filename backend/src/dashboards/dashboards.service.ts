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
  ) {}

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
    return {  };
  }

  async securityTrends(): Promise<any> {
    return {  };
  }
}