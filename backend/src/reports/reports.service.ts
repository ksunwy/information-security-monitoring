import { Injectable, NotFoundException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { AssetsService } from '../assets/assets.service';
import { VulnerabilitiesService } from '../vulnerabilities/vulnerabilities.service';

@Injectable()
export class ReportsService {
  constructor(
    private assetsService: AssetsService,
    private vulnsService: VulnerabilitiesService,
  ) { }

  async generatePdf(assetId: number): Promise<string> {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const asset = await this.assetsService.findOne(assetId);
    if (!asset) {
      throw new NotFoundException(`Актив ${assetId} не найден`);
    }

    const vulns = await this.vulnsService.findByAsset(assetId);

    const doc = new PDFDocument({ autoFirstPage: false });

    const fontsDir = path.join(process.cwd(), 'fonts');
    const fontPath = path.join(fontsDir, 'arial.ttf');

    if (!fs.existsSync(fontPath)) {
      throw new Error('Шрифт не найден');
    }

    doc.registerFont('Arial', fontPath);
    doc.font('Arial');

    doc.addPage();
    doc.fontSize(25).text(`Отчёт по активу: ${asset.name || 'Без названия'}`);
    doc.fontSize(14).text(`IP: ${asset.ip}`);
    doc.moveDown();

    doc.fontSize(18).text('Уязвимости:');
    doc.moveDown(0.5);

    if (vulns.length === 0) {
      doc.fontSize(12).text('Нет обнаруженных уязвимостей');
    } else {
      vulns.forEach((vuln, index) => {
        doc.fontSize(12).text(`${index + 1}. ${vuln.cveId || 'Нет CVE'}`);
        doc.text(`   CVSS: ${vuln.cvssScore || 'N/A'} (${vuln.severity || 'N/A'})`);
        doc.text(`   Статус: ${vuln.fixed ? 'Исправлена' : 'Активна'}`);
        doc.text(`   Описание: ${vuln.description || 'Нет описания'}`);
        doc.moveDown(1);
      });
    }

    const fileName = `report_asset_${assetId}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.end();

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return filePath;
  }

  async exportCsv(assetId: number): Promise<string> {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const vulns = await this.vulnsService.findByAsset(assetId);
    const fileName = `vulnerabilities_asset_${assetId}.csv`;
    const filePath = path.join(reportsDir, fileName);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'cveId', title: 'CVE ID' },
        { id: 'description', title: 'Description' },
        { id: 'cvssScore', title: 'CVSS Score' },
        { id: 'criticality', title: 'Criticality' },
        { id: 'fixed', title: 'Fixed' },
        { id: 'detectedAt', title: 'Detected at' },
      ],
      fieldDelimiter: ';',
      encoding: 'utf8',
    });

    await csvWriter.writeRecords(vulns);

    const csvContent = fs.readFileSync(filePath, 'utf8');
    const csvWithBom = '\uFEFF' + csvContent;
    fs.writeFileSync(filePath, csvWithBom, { encoding: 'utf8' });

    return filePath;
  }

}