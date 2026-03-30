import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './asset.entity';
import { Request } from '@nestjs/common';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly service: AssetsService) { }

  @Post()
  @ApiOperation({ summary: 'Создать новый актив (устройство/сервер)' })
  @ApiBody({ type: CreateAssetDto })
  @ApiCreatedResponse({
    description: 'Актив успешно создан',
    type: Asset,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные (валидация DTO)',
  })
  async create(@Body() dto: CreateAssetDto, @Request() req): Promise<Asset> {
    const userId = req.user.id;
    return this.service.create({ ...dto, userId });
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех активов' })
  @ApiOkResponse({
    description: 'Список всех активов с их сканами и уязвимостями',
    type: [Asset],
  })
  async findAll(): Promise<Asset[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию по одному активу' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID актива',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Данные актива (включая сканы и уязвимости)',
    type: Asset,
  })
  @ApiNotFoundResponse({ description: 'Актив не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Asset> {
    const asset = await this.service.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Актив с ID ${id} не найден`);
    }
    return asset;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные актива' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateAssetDto })
  @ApiOkResponse({
    description: 'Актив успешно обновлён',
    type: Asset,
  })
  @ApiNotFoundResponse({ description: 'Актив не найден' })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssetDto,
  ): Promise<Asset> {
    const updated = await this.service.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Актив с ID ${id} не найден`);
    }
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить актив' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Актив успешно удалён',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Актив с ID 1 успешно удалён' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Актив не найден' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.service.delete(id);
    return { message: `Актив с ID ${id} успешно удалён` };
  }

  @Get('recent')
  @ApiOperation({
    summary: 'Получить последние добавленные активы',
    description: 'Возвращает последние 5 активов, отсортированных по дате создания (DESC).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество активов (по умолчанию 5)',
    example: 5,
  })
  @ApiOkResponse({
    description: 'Список последних активов',
    type: [Asset],
  })
  async getRecent(@Query('limit') limit = 5): Promise<Asset[]> {
    return this.service.findRecent(limit);
  }
}