import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('pdf/:assetId')
  @ApiOperation({
    summary: 'Сгенерировать и скачать PDF-отчёт по активу',
    description: 'Генерирует PDF с данными актива и уязвимостями. Файл скачивается автоматически.',
  })
  @ApiParam({ name: 'assetId', type: Number, example: 1 })
  @ApiProduces('application/pdf')
  @ApiOkResponse({
    description: 'PDF-файл отчёта',
    content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
  })
  @ApiNotFoundResponse({ description: 'Актив не найден' })
  async pdf(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const filePath = await this.service.generatePdf(assetId);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('PDF-файл не был создан');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="asset_${assetId}_report.pdf"`,
      );

      res.download(filePath, `asset_${assetId}_report.pdf`, (err) => {
        if (err) {
          console.error('Ошибка отправки PDF:', err);
        }
      });
    } catch (error) {
      console.error('Ошибка генерации/отправки PDF:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Ошибка сервера при генерации PDF');
    }
  }

  @Get('csv/:assetId')
  @ApiOperation({
    summary: 'Сгенерировать и скачать CSV-отчёт по уязвимостям',
    description: 'Генерирует CSV-файл со списком уязвимостей актива.',
  })
  @ApiParam({ name: 'assetId', type: Number, example: 1 })
  @ApiProduces('text/csv')
  @ApiOkResponse({
    description: 'CSV-файл отчёта',
    content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } },
  })
  @ApiNotFoundResponse({ description: 'Актив не найден или нет уязвимостей' })
  async csv(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const filePath = await this.service.exportCsv(assetId);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('CSV-файл не был создан');
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="vulnerabilities_asset_${assetId}.csv"`,
      );

      res.download(filePath, `vulnerabilities_asset_${assetId}.csv`, (err) => {
        if (err) {
          console.error('Ошибка отправки CSV:', err);
        }
      });
    } catch (error) {
      console.error('Ошибка генерации/отправки CSV:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Ошибка сервера при генерации CSV');
    }
  }
}