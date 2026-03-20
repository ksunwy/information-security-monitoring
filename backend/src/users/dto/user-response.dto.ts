import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 5, description: 'Уникальный ID пользователя' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'ivanov123', description: 'Логин' })
  login: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя / отображаемое имя' })
  name: string;

  @ApiProperty({
    example: 'observer',
    enum: ['admin', 'observer', 'manager'],
    description: 'Роль пользователя',
  })
  role: string;

  @ApiProperty({
    example: '2026-01-10T14:30:00.000Z',
    description: 'Дата создания аккаунта',
  })
  createdAt: Date;
}