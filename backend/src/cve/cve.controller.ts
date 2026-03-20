// src/cve/cve.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CveService } from './cve.service';

@ApiTags('CVE')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cves')
export class CveController {
  constructor(private readonly cveService: CveService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список CVE',
    description: 'Подтягивает список CVE из NVD API с фильтрами (поиск по ключевым словам, пагинация).',
  })
  @ApiQuery({
    name: 'keywordSearch',
    type: String,
    required: false,
    description: 'Ключевые слова для поиска (например, "apache", "heartbleed")',
    example: 'apache',
  })
  @ApiQuery({
    name: 'resultsPerPage',
    type: Number,
    required: false,
    description: 'Количество результатов на страницу (макс. 2000)',
    example: 10,
  })
  @ApiQuery({
    name: 'startIndex',
    type: Number,
    required: false,
    description: 'Смещение для пагинации',
    example: 0,
  })
  @ApiOkResponse({ description: 'Список CVE из NVD API' })
  @ApiBadRequestResponse({ description: 'Некорректные параметры или ошибка NVD' })
  async getCveList(
    @Query('keywordSearch') keywordSearch?: string,
    @Query('resultsPerPage') resultsPerPage = 10,
    @Query('startIndex') startIndex = 0,
  ): Promise<any> {
    return this.cveService.getCveList(keywordSearch, resultsPerPage, startIndex);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor) 
  @ApiOperation({
    summary: 'Получить детали одной CVE',
    description: 'Подтягивает детали CVE по ID через поиск (keywordSearch), так как NVD v2.0 не всегда поддерживает прямой запрос по cveId для старых CVE.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'CVE ID в формате CVE-YYYY-NNNNN',
    example: 'CVE-2024-31880',
  })
  @ApiOkResponse({ description: 'Детали CVE (или пустой результат)' })
  @ApiNotFoundResponse({ description: 'CVE не найдено или временно недоступно' })
  @ApiBadRequestResponse({ description: 'Некорректный формат ID или ошибка NVD' })
  async getCveDetail(@Param('id') id: string): Promise<any> {
    return this.cveService.getCveDetail(id);
  }
}