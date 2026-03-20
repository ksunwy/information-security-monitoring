import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CveController } from './cve.controller';
import { CveService } from './cve.service';

@Module({
  imports: [HttpModule],
  controllers: [CveController],
  providers: [CveService],
  exports: [CveService],
})
export class CveModule {}