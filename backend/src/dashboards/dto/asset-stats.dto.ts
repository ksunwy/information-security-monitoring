import { ApiProperty } from '@nestjs/swagger';

export class AssetStatsDto {
  @ApiProperty({
    example: 120,
    description: 'Общее количество зарегистрированных активов в системе',
  })
  total: number;

  @ApiProperty({
    example: 45,
    description: 'Количество активов, на которых хотя бы одна уязвимость обнаружена',
  })
  withVulns: number;

  @ApiProperty({
    example: 75,
    description: 'Количество активов без обнаруженных уязвимостей (вычисляется как total - withVulns)',
  })
  withoutVulns: number;
}