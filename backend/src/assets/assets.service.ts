import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { LogsService } from 'src/systemLogs/logs.service';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private repo: Repository<Asset>, private logsService: LogsService) { }

  async create(dto: CreateAssetDto & { userId: number }): Promise<Asset> {
    const exists = await this.repo.findOne({
      where: { ip: dto.ip, userId: dto.userId },
    });

    if (exists) {
      await this.logsService.create({
        type: 'user_activity',
        message: `Попытка создать дубликат актива IP=${dto.ip}`,
        userId: dto.userId,
      });

      throw new BadRequestException('Актив с таким IP уже существует');
    }

    const asset = this.repo.create(dto);
    const saved = await this.repo.save(asset);

    await this.logsService.create({
      type: 'user_activity',
      message: `Создан актив IP=${dto.ip}`,
      userId: dto.userId,
    });

    return saved;
  }

  async findAll(): Promise<Asset[]> {
    const assets = await this.repo.find({ relations: ['scans', 'vulnerabilities'] });

    return assets.map((asset) => {
      const criticalityOrder = { low: 0, medium: 1, high: 2, critical: 3 };

      const maxCriticality = asset.vulnerabilities?.length
        ? asset.vulnerabilities.reduce((max, v) => {
          const severity = (v.severity || 'low').toLowerCase();
          return criticalityOrder[severity] > criticalityOrder[max] ? severity : max;
        }, 'low')
        : 'none';

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

  async findOne(id: number): Promise<any> {
    const asset = await this.repo.findOne({ where: { id }, relations: ['scans', 'vulnerabilities'] });
    if (!asset) return null;

    const criticalityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
    const maxCriticality = asset.vulnerabilities?.length
      ? asset.vulnerabilities.reduce((max, v) => {
        return criticalityOrder[v.severity] > criticalityOrder[max] ? v.severity : max;
      }, 'low')
      : 'none';

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
  }

  async update(id: number, dto: Partial<Asset>): Promise<Asset> {
    await this.logsService.create({
      type: 'user_activity',
      message: `Обновлён актив id=${id}`,
    });

    return this.repo.save({ id, ...dto });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
    await this.logsService.create({
      type: 'user_activity',
      message: `Удалён актив id=${id}`,
    });
  }

  async findRecent(limit = 10): Promise<Asset[]> {
    return this.repo.find({
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['scans', 'vulnerabilities'],
    });
  }
}