import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScansService } from './scans.service';
import { Scan } from './scan.entity';
import { Request } from 'express';

export interface JwtSecretRequestType extends Request {
  user: {
    id: number;
    email: string;
  };
}

@ApiTags('Scans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scans')
export class ScansController {
  constructor(private readonly service: ScansService) { }

  @Post(':assetId')
  @ApiOperation({
    summary: 'Запустить сканирование актива',
    description: 'Выполняет сканирование указанного актива, сохраняет результаты, обновляет историю изменений и ищет связанные уязвимости',
  })
  @ApiParam({
    name: 'assetId',
    type: Number,
    description: 'ID актива, который нужно просканировать',
    example: 1,
  })
  @ApiCreatedResponse({
    description: 'Сканирование успешно запущено и сохранено',
    type: Scan,
  })
  @ApiNotFoundResponse({
    description: 'Актив с указанным ID не найден',
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при выполнении сканирования (например, недоступен хост или ошибка Nmap)',
  })
  async scan(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Req() req: JwtSecretRequestType,
  ): Promise<Scan> {
    const userId = req.user.id;

    return this.service.scanAsset(assetId);
  }

  @Get('history/:assetId')
  @ApiOperation({
    summary: 'Получить историю сканирований актива',
    description: 'Возвращает все предыдущие сканирования актива, отсортированные по дате (от новых к старым)',
  })
  @ApiParam({
    name: 'assetId',
    type: Number,
    description: 'ID актива, для которого нужна история',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Список всех сканирований актива',
    type: [Scan],
  })
  @ApiNotFoundResponse({
    description: 'Актив не найден или у него нет истории сканирований',
  })
  async history(@Param('assetId', ParseIntPipe) assetId: number): Promise<Scan[]> {
    return this.service.getHistory(assetId);
  }
}