import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseEnumPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogsService } from './logs.service';
import { LogResponseDto } from './dto/log.dto';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) { }

  @Get()
  @ApiOperation({
    summary: 'Получить список всех логов системы',
    description:
      'Возвращает историю событий системы: сканирования активов и действия пользователей (логин, создание актива, запуск сканирования и т.д.). ' +
      'Логи отсортированы по времени (от новых к старым). ' +
      'Можно отфильтровать по типу: scan (сканирования) или user_activity (действия пользователей).',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description:
      'Фильтр по типу лога. Если не указан — возвращаются все логи. ' +
      'scan — события сканирования активов (Nmap, обнаружение портов/сервисов). ' +
      'user_activity — действия пользователей (логин, регистрация, удаление и т.д.).',
    example: 'scan',
  })
  @ApiOkResponse({
    description: 'Список логов успешно получен (отсортирован от новых к старым)',
    type: [LogResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'Некорректное значение параметра type',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
  })
  async findAll(
  @Query('type')
  type?: 'user_activity' | 'scan_start' | 'scan_result' | 'scan',
): Promise<LogResponseDto[]> {

  const allowedTypes = [
    'user_activity',
    'scan_start',
    'scan_result',
    'scan',
  ];

  if (type && !allowedTypes.includes(type)) {
    throw new BadRequestException('Недопустимый тип лога');
  }

  const logs = await this.service.findAll(type);

  return logs.map((log) => ({
    id: log.id,
    type: log.type as
      | 'user_activity'
      | 'scan_start'
      | 'scan_result'
      | 'scan',
    message: log.message,
    timestamp: log.timestamp,
    user: log.user
      ? {
          id: log.user.id,
          login: log.user.login,
          name: log.user.name,
        }
      : null,
  }));
}
}