import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ivanov123' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'strongpass123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['admin', 'observer', 'manager'], example: 'observer' })
  @IsEnum(['admin', 'observer', 'manager'])
  role?: string;
}