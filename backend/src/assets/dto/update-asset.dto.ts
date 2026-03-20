import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAssetDto {
  @ApiPropertyOptional({
    example: '192.168.1.101',
    description: 'Новый IP-адрес (если меняется)',
  })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiPropertyOptional({
    example: 'Новый сервер',
    description: 'Новое название',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Обновлённое описание',
    description: 'Новое описание',
  })
  @IsString()
  @IsOptional()
  description?: string;
}