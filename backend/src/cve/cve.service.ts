import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CveService {
  constructor(private readonly httpService: HttpService) {}

  private readonly nvdApiKey = '6c3e95b7-a82f-4741-a967-d87f69bc5c8f';

  private get headers() {
    return {
      apiKey: this.nvdApiKey,
    };
  }

  async getCveList(keywordSearch?: string, resultsPerPage = 10, startIndex = 0): Promise<any> {
    let url = `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=${resultsPerPage}&startIndex=${startIndex}`;

    if (keywordSearch) {
      url += `&keywordSearch=${encodeURIComponent(keywordSearch)}`;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: this.headers }),
      );
      return response.data;
    } catch (err: any) {
      console.error('NVD list error:', err.response?.data || err.message);
      if (err.response?.status === 429) {
        throw new BadRequestException('Превышен лимит запросов. Подождите или используйте API-ключ');
      }
      throw new BadRequestException('Ошибка при запросе списка CVE');
    }
  }

  async getCveDetail(id: string): Promise<any> {
    if (!id.match(/^CVE-\d{4}-\d{4,7}$/i)) {
      throw new BadRequestException('Некорректный формат CVE ID (CVE-YYYY-NNNNN)');
    }

    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(id)}&resultsPerPage=1`;

    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers: this.headers }));

      if (!response.data || response.data.totalResults === 0 || !response.data.vulnerabilities?.length) {
        throw new NotFoundException(`CVE с ID ${id} не найдено в NVD`);
      }

      return response.data.vulnerabilities[0];
    } catch (err: any) {
      console.error(`NVD error for ${id}:`, {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 429) {
        throw new BadRequestException('Превышен лимит запросов к NVD. Подождите 30 секунд.');
      }

      if (err.response?.status >= 500 || typeof err.response?.data === 'string' && err.response.data.includes('<html>')) {
        throw new NotFoundException(`CVE с ID ${id} временно недоступно в NVD`);
      }

      throw new BadRequestException(`Ошибка при запросе CVE: ${err.message}`);
    }
  }
}