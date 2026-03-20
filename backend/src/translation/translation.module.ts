import { Module } from '@nestjs/common';
import { LocalTranslationService } from './local-translation.service';

@Module({
  providers: [LocalTranslationService],
  exports: [LocalTranslationService],
})
export class TranslationModule {}