import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Scan } from './scan.entity';
import { ScansService } from './scans.service';
import { ScansController } from './scans.controller';
import { AssetsModule } from '../assets/assets.module';
import { VulnerabilitiesModule } from '../vulnerabilities/vulnerabilities.module';
import { LogsModule } from '../systemLogs/logs.module';
import { CveModule } from 'src/cve/cve.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scan]),
    ScheduleModule.forRoot(),
    AssetsModule,
    VulnerabilitiesModule,
    LogsModule,
    CveModule,
  ],
  providers: [ScansService],
  controllers: [ScansController],
  exports: [ ScansService,],
})
export class ScansModule { }