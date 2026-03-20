import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('vulnerabilities')
  @ApiOperation({ summary: 'Аналитика по уязвимостям (общая + персональная)' })
  @ApiOkResponse({ description: 'Статистика уязвимостей для графиков и карточек' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  async vulnAnalytics(@User() user: JwtPayload) {
    return this.service.getVulnAnalytics(user.id);
  }

  @Get('assets')
  @ApiOperation({ summary: 'Аналитика по активам (общая + персональная)' })
  @ApiOkResponse({ description: 'Статистика активов для графиков' })
  async assetAnalytics(@User() user: JwtPayload) {
    return this.service.getAssetAnalytics(user.id);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Тренды информационной безопасности (из CVE)' })
  @ApiOkResponse({ description: 'Последние тренды для виджетов' })
  async ibTrends() {
    return this.service.getIbTrends();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Аналитика по отчётам пользователя' })
  @ApiOkResponse({ description: 'Статистика отчётов для дашборда' })
  async reportAnalytics(@User() user: JwtPayload) {
    return this.service.getReportAnalytics(user.id);
  }
}