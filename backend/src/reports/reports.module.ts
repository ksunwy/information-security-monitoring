import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AssetsModule } from '../assets/assets.module';
import { VulnerabilitiesModule } from '../vulnerabilities/vulnerabilities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Asset } from 'src/assets/asset.entity';
import { User } from 'src/common/decorators/user.decorator';

@Module({
  imports: [AssetsModule, VulnerabilitiesModule, TypeOrmModule.forFeature([Report, Asset, User])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}