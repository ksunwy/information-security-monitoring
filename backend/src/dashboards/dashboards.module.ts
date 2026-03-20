import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { VulnerabilitiesModule } from '../vulnerabilities/vulnerabilities.module';
import { AssetsModule } from '../assets/assets.module';
import { ScansModule } from '../scans/scans.module';

@Module({
  imports: [VulnerabilitiesModule, AssetsModule, ScansModule],
  providers: [DashboardsService],
  controllers: [DashboardsController],
})
export class DashboardsModule {}