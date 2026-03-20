import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({
    example: '192.168.1.100',
    description: 'IP-адрес или hostname актива',
  })
  @IsString()
  @IsNotEmpty({ message: 'IP-адрес обязателен' })
  ip: string;

  @ApiProperty({
    example: 'Сервер в дата-центре',
    description: 'Название / описание актива',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название актива обязательно' })
  name: string;

  @ApiProperty({
    example: 'Основной веб-сервер компании',
    description: 'Дополнительное описание (необязательно)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}