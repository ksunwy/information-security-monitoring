
import { ApiProperty } from '@nestjs/swagger';

export class TrendEntry {
  @ApiProperty({
    example: '2025-11',
    description: 'Период в формате YYYY-MM (месяц и год)',
  })
  period: string;

  @ApiProperty({
    example: 78,
    description: 'Индекс безопасности за этот период (0–100)',
  })
  securityIndex: number;

  @ApiProperty({
    example: -4,
    description: 'Изменение индекса по сравнению с предыдущим периодом',
  })
  change: number;
}

export class SecurityTrendsDto {
  @ApiProperty({
    example: 85,
    description: 'Текущий общий индекс безопасности системы (0–100)',
  })
  currentSecurityIndex: number;

  @ApiProperty({
    example: -12,
    description:
      'Изменение индекса за последний месяц (отрицательное — ухудшение, положительное — улучшение)',
  })
  changeLastMonth: number;

  @ApiProperty({
    example: 'Улучшение на 8 пунктов за квартал',
    description: 'Краткое текстовое резюме тренда (для карточки дашборда)',
  })
  trendSummary: string;

  @ApiProperty({
    type: [TrendEntry],
    description:
      'История тренда безопасности по месяцам. Массив объектов с периодом и значением индекса.',
  })
  trendHistory: TrendEntry[];

  @ApiProperty({
    example: 'monthly',
    description: 'Гранулярность данных (monthly / quarterly / yearly)',
  })
  granularity: 'monthly' | 'quarterly' | 'yearly';

  @ApiProperty({
    example: 6,
    description: 'Количество периодов в тренде (например, последние 6 месяцев)',
  })
  periodsCount: number;
}