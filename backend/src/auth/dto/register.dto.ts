import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({ example: 'testuser', description: 'Логин' })
  @IsString()
  @IsNotEmpty({ message: 'Логин обязателен' })
  login: string;

  @ApiProperty({ example: 'Тест Тестов', description: 'Имя' })
  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @ApiProperty({ 
    example: 'StrongP@ssw0rd', 
    description: 'Пароль (минимум 8 символов, содержит цифры, спецсимволы, заглавные и строчные буквы)' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/(?=.*\d)/, { message: 'Пароль должен содержать хотя бы одну цифру' })
  @Matches(/(?=.*[a-z])/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
  @Matches(/(?=.*[A-Z])/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Пароль должен содержать хотя бы один спецсимвол (@$!%*?&)' })
  password: string;
}