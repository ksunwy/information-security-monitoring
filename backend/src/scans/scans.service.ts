import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scan } from './scan.entity';
import { AssetsService } from '../assets/assets.service';
import { VulnerabilitiesService } from '../vulnerabilities/vulnerabilities.service';
import { LogsService } from '../systemLogs/logs.service';
import { CveService } from '../cve/cve.service';
import * as nmap from 'node-nmap';
import axios from 'axios';

export interface NmapPort {
  port: number;
  protocol: string;
  service: string;
  version: string | null;
}

export interface ScanChanges {
  addedPorts: NmapPort[];
  removedPorts: NmapPort[];
  summary: string;
}

export interface ZapScanResult {
  scanId: string;
  alertsCount: number;
  durationMs: number;
}

@Injectable()
export class ScansService {
  constructor(
    @InjectRepository(Scan) private repo: Repository<Scan>,
    private assetsService: AssetsService,
    private vulnsService: VulnerabilitiesService,
    private logsService: LogsService,
    private cveService: CveService,
  ) { }

  async scanAsset(assetId: number): Promise<Scan> {
    const asset = await this.assetsService.findOne(assetId);
    if (!asset) throw new NotFoundException(`Актив с ID ${assetId} не найден`);

    await this.logsService.create({
      type: 'scan_start',
      message: `Запущено сканирование актива ${assetId} (${asset.ip})`,
    });

    const [ipOnly] = asset.ip.split(':');
    const scanResult = await this.runNmapScan(ipOnly, asset.ip.includes(':') ? asset.ip.split(':')[1] : undefined);

    const ports: NmapPort[] = scanResult.openPorts.map(p => ({
      port: p.port,
      protocol: p.protocol || 'tcp',
      service: p.service || 'unknown',
      version: p.version || null,
    }));

    await this.matchServicesToVulns(assetId, ports);

    const prevScans = await this.repo.find({ where: { asset: { id: assetId } }, order: { scannedAt: 'DESC' }, take: 1 });
    const changes = prevScans.length > 0 ? this.computeChanges(prevScans[0].ports, ports) : null;

    const WEB_PORTS = new Set([80, 443, 3000, 4000, 8000, 8080, 8443, 8888]);
    const hasWeb = ports.some(p => WEB_PORTS.has(p.port) || p.service.includes('http'));

    let zapResult: ZapScanResult | null = null;
    if (hasWeb) {
      zapResult = await this.runZapScan(asset, ports);
    }

    const scan = this.repo.create({
      asset,
      ports,
      changes,
      status: 'completed',
      scan_type: hasWeb ? 'web+network' : 'network',
      scan_result: hasWeb
        ? `Сканирование завершено. ZAP алертов: ${zapResult!.alertsCount}`
        : 'scan completed',

      zapScanId: zapResult?.scanId || null,
      webVulnerabilitiesCount: zapResult?.alertsCount || 0,
      zapDurationMs: zapResult?.durationMs || null,
      scanResultDetails: hasWeb
        ? `ZAP: ${zapResult!.alertsCount} уязвимостей за ${Math.round(zapResult!.durationMs / 1000)} сек.`
        : null,
    });

    const savedScan = await this.repo.save(scan);

    await this.logsService.create({
      type: 'scan_result',
      message: `Сканирование завершено. Портов: ${ports.length}. ZAP уязвимостей: ${zapResult?.alertsCount || 0}. ${changes?.summary || 'Первое сканирование.'}`,
    });

    return savedScan;
  }

  private async runNmapScan(ip: string, port?: string): Promise<{ openPorts: any[] }> {
    return new Promise((resolve, reject) => {
      const args = port
        ? `-p ${port}`
        : '-p-';
      const scan = new nmap.NmapScan(ip, args);

      scan.on('complete', (data: any[]) => {
        if (!data || data.length === 0) return resolve({ openPorts: [] });
        resolve({ openPorts: data[0].openPorts || [] });
      });

      scan.on('error', (err: any) => {
        reject(new BadRequestException(`Ошибка Nmap: ${err.message || 'Неизвестная ошибка'}`));
      });

      scan.startScan();
    });
  }

  private computeChanges(prevPorts: NmapPort[], currPorts: NmapPort[]): ScanChanges {
    const key = (p: NmapPort) => `${p.port}-${p.protocol}-${p.service}-${p.version}`;
    const prevSet = new Set(prevPorts.map(key));
    const currSet = new Set(currPorts.map(key));

    const addedPorts = currPorts.filter(p => !prevSet.has(key(p)));
    const removedPorts = prevPorts.filter(p => !currSet.has(key(p)));

    return {
      addedPorts,
      removedPorts,
      summary: `Добавлено портов: ${addedPorts.length}, Удалено: ${removedPorts.length}`,
    };
  }

  private async matchServicesToVulns(assetId: number, ports: NmapPort[]): Promise<void> {
    for (const port of ports) {
      if (port.service && port.version && port.version !== 'unknown') {
        const searchQuery = `${port.service} ${port.version}`;
        const cveList = await this.cveService.getCveList(searchQuery, 5, 0);

        if (cveList.vulnerabilities?.length > 0) {
          for (const vuln of cveList.vulnerabilities) {
            const cvssScore =
              vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
              vuln.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore ||
              0;
            const severity = this.determineSeverity(cvssScore);

            await this.vulnsService.createVulnerabilityFromCve({
              assetId,
              cveId: vuln.cve.id,
              description: vuln.cve.descriptions?.[0]?.value || 'Нет описания',
              cvssScore,
              severity,
              fixed: false,
            });
          }
        }
      }
    }
  }

  private determineSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 9.0) return 'critical';
    if (score >= 7.0) return 'high';
    if (score >= 4.0) return 'medium';
    return 'low';
  }

  async getHistory(assetId: number): Promise<Scan[]> {
    return this.repo.find({
      where: { asset: { id: assetId } },
      order: { scannedAt: 'DESC' },
      relations: ['asset'],
    });
  }

  private async runZapScan(asset: any, ports: NmapPort[]): Promise<ZapScanResult> {
    const startTime = Date.now();

    const [ipOnly, portOnly] = asset.ip.split(':');
    const protocol = ports.some(p => p.port === 443) ? 'https' : 'http';
    const dockerHost = ipOnly === '127.0.0.1' || ipOnly === 'localhost'
      ? 'host.docker.internal'
      : ipOnly;

    const targetUrl = portOnly
      ? `${protocol}://${dockerHost}:${portOnly}`
      : `${protocol}://${dockerHost}`;

    const ZAP_URL = process.env.ZAP_URL || 'http://localhost:8080';
    const ZAP_API_KEY = process.env.ZAP_API_KEY || 'change-me-9203935709';

    try {
      const spiderResp = await axios.get(`${ZAP_URL}/JSON/spider/action/scan/`, {
        params: { url: targetUrl, maxChildren: 10, maxDepth: 5, apikey: ZAP_API_KEY },
      });
      const spiderId = spiderResp.data.scan;

      let spiderStatus = 0;
      while (spiderStatus < 100) {
        await new Promise(r => setTimeout(r, 5000));
        const s = await axios.get(`${ZAP_URL}/JSON/spider/view/status/`, {
          params: { scanId: spiderId, apikey: ZAP_API_KEY },
        });
        spiderStatus = Number(s.data.status);
      }

      const scanResp = await axios.get(`${ZAP_URL}/JSON/ascan/action/scan/`, {
        params: {
          url: targetUrl,
          recurse: 'true',
          inScopeOnly: 'true',
          maxRuleDurationInMins: '3',
          maxScanDurationInMins: '15',
          maxRuleInactivityInMins: '2',
          apikey: ZAP_API_KEY,
        },
      });
      const scanId = scanResp.data.scan;

      let progress = 0;
      const scanStart = Date.now();
      while (progress < 100 && Date.now() - scanStart < 20 * 60 * 1000) {
        await new Promise(r => setTimeout(r, 10000));
        const status = await axios.get(`${ZAP_URL}/JSON/ascan/view/status/`, {
          params: { scanId, apikey: ZAP_API_KEY },
        });
        progress = Number(status.data.status);
      }

      const alertsResp = await axios.get(`${ZAP_URL}/JSON/core/view/alerts/`, {
        params: { baseurl: targetUrl, apikey: ZAP_API_KEY },
      });

      const alerts = alertsResp.data.alerts || [];
      let alertsCount = 0;

      for (const alert of alerts) {
        alertsCount++;
        await this.vulnsService.createVulnerabilityFromCve({
          assetId: asset.id,
          cveId: null,
          description: `${alert.name}\n${alert.description || ''}\nEvidence: ${alert.evidence || '—'}`.trim(),
          cvssScore: this.mapRiskToScore(alert.risk),
          severity: this.mapRiskToSeverity(alert.risk),
          fixed: false,
        });
      }

      const durationMs = Date.now() - startTime;

      return { scanId, alertsCount, durationMs };

    } catch (error) {
      console.error('ZAP Error:', error);
      throw new BadRequestException(`ZAP failed: ${error}`);
    }
  }

  private mapRiskToSeverity(risk: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (risk.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'low';
    }
  }

  private mapRiskToScore(risk: string): number {
    switch (risk.toLowerCase()) {
      case 'high': return 8;
      case 'medium': return 5;
      case 'low': return 2;
      default: return 1;
    }
  }
}


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}