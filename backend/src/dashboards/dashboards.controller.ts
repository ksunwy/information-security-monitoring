import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardsService } from './dashboards.service';
import { VulnDistributionDto } from './dto/vuln-distribution.dto';
import { AssetStatsDto } from './dto/asset-stats.dto';
import { VulnDynamicsDto } from './dto/vuln-dynamics.dto';
import { SecurityTrendsDto } from './dto/security-trends.dto';

@ApiTags('Dashboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly service: DashboardsService) { }

  @Get('vuln-distribution')
  @ApiOperation({
    summary: 'Распределение уязвимостей по уровню критичности',
    description:
      'Возвращает количество уязвимостей, сгруппированных по уровням: Low, Medium, High, Critical. ' +
      'Используется для построения круговой диаграммы или пирога на дашборде. ' +
      'Данные агрегируются по всем активам в системе.',
  })
  @ApiOkResponse({
    description: 'Успешно получено распределение уязвимостей',
    type: VulnDistributionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при получении данных (например, проблема с базой данных)',
  })
  async vulnDistribution(): Promise<VulnDistributionDto> {
    try {
      return await this.service.vulnDistribution();
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить распределение уязвимостей');
    }
  }

  @Get('asset-stats')
  @ApiOperation({
    summary: 'Основная статистика по активам',
    description:
      'Возвращает общее количество активов и сколько из них имеют хотя бы одну уязвимость. ' +
      'Полезно для карточек дашборда: "Всего активов", "С уязвимостями", "Безопасные".',
  })
  @ApiOkResponse({
    description: 'Успешно получена статистика активов',
    type: AssetStatsDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при получении статистики',
  })
  async assetStats(): Promise<AssetStatsDto> {
    try {
      const stats = await this.service.assetStats();
      return {
        ...stats,
        withoutVulns: stats.total - stats.withVulns,
      };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить статистику активов');
    }
  }

  @Get('vuln-dynamics')
  @ApiOperation({
    summary: 'Динамика появления и исправления уязвимостей',
    description:
      'Возвращает временной ряд: сколько новых уязвимостей появилось и сколько было исправлено ' +
      'за каждый период (обычно месяц). Используется для линейного графика тренда безопасности.',
  })
  @ApiOkResponse({
    description: 'Успешно получена динамика уязвимостей',
    type: VulnDynamicsDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при агрегации данных по времени',
  })
  async vulnDynamics(): Promise<VulnDynamicsDto> {
    try {
      return await this.service.vulnDynamics();
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить динамику уязвимостей');
    }
  }

  @Get('security-trends')
  @ApiOperation({
    summary: 'Тренды общей безопасности системы',
    description:
      'Возвращает общий индекс безопасности (0–100) и его изменение за последний месяц, ' +
      'а также историю тренда. Может использоваться для графика "Общий уровень безопасности" ' +
      'и ключевых метрик на главной странице дашборда.',
  })
  @ApiOkResponse({
    description: 'Успешно получены тренды безопасности',
    type: SecurityTrendsDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при расчёте трендов',
  })
  async securityTrends(): Promise<SecurityTrendsDto> {
    try {
      return await this.service.securityTrends();
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить тренды безопасности');
    }
  }

  @Get('vuln-dynamics/me')
  @ApiOperation({
    summary: 'Динамика уязвимостей текущего пользователя',
    description: 'Возвращает временной ряд уязвимостей только для активов текущего пользователя',
  })
  @ApiOkResponse({
    description: 'Успешно получена динамика уязвимостей пользователя',
    type: [VulnDynamicsDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при агрегации данных',
  })
  async vulnDynamicsByUser(@Req() req: any): Promise<{ date: string; count: number }[]> {
    try {
      const userId = req.user.id;
      return await this.service.vulnDynamicsByUser(userId);
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить динамику уязвимостей пользователя');
    }
  }
}