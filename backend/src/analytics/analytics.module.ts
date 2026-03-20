import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vulnerability } from '../vulnerabilities/vulnerability.entity';
import { Asset } from '../assets/asset.entity';
import { CveModule } from '../cve/cve.module'; 
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Report } from 'src/reports/report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vulnerability, Asset, Report]),
    CveModule, 
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}