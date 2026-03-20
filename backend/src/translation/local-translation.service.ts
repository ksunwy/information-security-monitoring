import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class LocalTranslationService implements OnModuleInit {
  private translator: any;
  private cache = new Map<string, string>();

  async onModuleInit() {
    console.log('⏳ Loading translation model...');

    this.translator = await pipeline(
      'translation',
      'Xenova/opus-mt-en-ru'
    );

    console.log('✅ Translation model loaded');
  }

  async translateToRu(text: string): Promise<string> {
    if (!text || text.length < 10) return text;

    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    try {
      const chunks = text.match(/.{1,400}/g) || [];

      const translatedChunks: string[] = [];

      for (const chunk of chunks) {
        const result = await this.translator(chunk, {
          max_length: 512,
        });

        translatedChunks.push(result[0]?.translation_text || chunk);
      }

      const translated = translatedChunks.join(' ');

      this.cache.set(text, translated);

      return translated;
    } catch (err) {
      console.error('Translation error:', err);
      return text;
    }
  }
}