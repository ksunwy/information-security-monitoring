import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: 'Логин пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Логин обязателен' })
  login: string;

  @ApiProperty({ example: '123456', description: 'Пароль' })
  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}