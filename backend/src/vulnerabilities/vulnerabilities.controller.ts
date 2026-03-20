import {
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VulnerabilitiesService } from './vulnerabilities.service';
import { Vulnerability } from './vulnerability.entity';

@ApiTags('Vulnerabilities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vulnerabilities')
export class VulnerabilitiesController {
  constructor(private readonly service: VulnerabilitiesService) { }

  @Get(':assetId')
  @ApiOperation({
    summary: 'Получить все уязвимости для конкретного актива',
    description: 'Возвращает список всех обнаруженных уязвимостей, связанных с активом по его ID. Уязвимости включают CVE ID, описание, CVSS score, уровень критичности и статус исправления.',
  })
  @ApiParam({
    name: 'assetId',
    type: Number,
    description: 'ID актива, для которого нужно получить уязвимости',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Список уязвимостей актива (может быть пустым)',
    type: [Vulnerability],
  })
  @ApiNotFoundResponse({
    description: 'Актив не найден или у него нет связанных уязвимостей',
  })
  async findByAsset(
    @Param('assetId', ParseIntPipe) assetId: number,
  ): Promise<Vulnerability[]> {
    const vulns = await this.service.findByAsset(assetId);

    return vulns ?? [];
  }

  @Get()
  @ApiOperation({ summary: 'Получить список уязвимостей (с фильтрами)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  async findAll(
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: string,
  ): Promise<Vulnerability[]> {
    return this.service.findAll({ limit, orderBy });
  }

  @Put('fix/:id')
  @ApiOperation({
    summary: 'Пометить уязвимость как исправленную',
    description: 'Изменяет статус уязвимости на "исправлена" (fixed = true). Используется после того, как уязвимость была устранена (обновление ПО, патч и т.д.).',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID уязвимости, которую нужно пометить как исправленную',
    example: 42,
  })
  @ApiOkResponse({
    description: 'Уязвимость успешно помечена как исправленная',
    type: Vulnerability,
  })
  @ApiNotFoundResponse({
    description: 'Уязвимость с указанным ID не найдена',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный ID или другие ошибки валидации',
  })
  async markFixed(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Vulnerability> {
    const updatedVuln = await this.service.markFixed(id);

    if (!updatedVuln) {
      throw new NotFoundException(`Уязвимость с ID ${id} не найдена`);
    }

    return updatedVuln;
  }
}