import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newemail@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'newlogin' })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiPropertyOptional({ example: 'Иван Петров' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'newPass123' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'admin',
    enum: ['admin', 'observer', 'manager'],
    description: 'Изменение роли (только админ может менять)',
  })
  @IsString()
  @IsOptional()
  role?: string;
}