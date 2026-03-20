import { ApiProperty } from '@nestjs/swagger';

export class UserShortDto {
  @ApiProperty({ example: 5, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'admin', description: 'Логин' })
  login: string;

  @ApiProperty({ example: 'Администратор', description: 'Имя/отображаемое имя' })
  name: string;
}

export class LogResponseDto {
  @ApiProperty({
    example: 42,
    description: 'Уникальный идентификатор записи лога',
  })
  id: number;

  @ApiProperty({
    example: "scan_start",
    description: 'Тип лога: сканирование системы или активность пользователя',
  })
  type: 'user_activity' | 'scan_start' | 'scan_result' | 'scan';

  @ApiProperty({
    example: 'Запущено сканирование актива ID 15 (IP: 192.168.1.100)',
    description: 'Текстовое сообщение лога (что именно произошло)',
  })
  message: string;

  @ApiProperty({
    example: '2026-01-17T08:45:12.345Z',
    description: 'Дата и время создания записи лога (ISO 8601)',
  })
  timestamp: Date;

  @ApiProperty({
    type: () => UserShortDto,  
    nullable: true,
    description:
      'Пользователь, который совершил действие (только для логов типа user_activity). ' +
      'Для логов типа scan поле будет null.',
  })
  user?: UserShortDto | null;
}