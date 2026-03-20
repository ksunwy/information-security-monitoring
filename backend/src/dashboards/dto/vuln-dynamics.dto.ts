import { ApiProperty } from '@nestjs/swagger';

class DynamicsEntry {
  @ApiProperty({ example: '2025-12', description: 'Месяц и год в формате YYYY-MM' })
  period: string;

  @ApiProperty({ example: 12, description: 'Количество новых уязвимостей за период' })
  new: number;

  @ApiProperty({ example: 8, description: 'Количество исправленных уязвимостей за период' })
  fixed: number;
}

export class VulnDynamicsDto {
  @ApiProperty({
    type: [DynamicsEntry],
    description: 'Массив с динамикой появления/исправления уязвимостей по месяцам',
  })
  data: DynamicsEntry[];

  @ApiProperty({
    example: 'monthly',
    description: 'Период агрегации данных (monthly / weekly / yearly)',
  })
  granularity: string;
}