import { ApiProperty } from '@nestjs/swagger';

export class VulnDistributionDto {
  @ApiProperty({
    example: 15,
    description: 'Количество уязвимостей с уровнем критичности "Low" (низкий)',
  })
  low: number;

  @ApiProperty({
    example: 42,
    description: 'Количество уязвимостей с уровнем "Medium" (средний)',
  })
  medium: number;

  @ApiProperty({
    example: 28,
    description: 'Количество уязвимостей с уровнем "High" (высокий)',
  })
  high: number;

  @ApiProperty({
    example: 7,
    description: 'Количество уязвимостей с уровнем "Critical" (критический)',
  })
  critical: number;
}