import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AssetsModule } from '../assets/assets.module';
import { VulnerabilitiesModule } from '../vulnerabilities/vulnerabilities.module';

@Module({
  imports: [AssetsModule, VulnerabilitiesModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}