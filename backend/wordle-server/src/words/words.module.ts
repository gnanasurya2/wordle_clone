import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  controllers: [WordsController],
  providers: [WordsService],
  exports: [WordsService],
  imports: [StatsModule],
})
export class WordsModule {}
