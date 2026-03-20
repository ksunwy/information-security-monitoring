import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Vulnerability } from './vulnerability.entity';
import { VulnerabilitiesService } from './vulnerabilities.service';
import { VulnerabilitiesController } from './vulnerabilities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vulnerability]), HttpModule],
  providers: [VulnerabilitiesService],
  controllers: [VulnerabilitiesController],
  exports: [VulnerabilitiesService],
})
export class VulnerabilitiesModule {}