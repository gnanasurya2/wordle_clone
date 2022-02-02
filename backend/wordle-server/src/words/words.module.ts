import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { AuthModule } from 'src/auth/auth.module';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  controllers: [WordsController],
  providers: [WordsService],
  exports: [WordsService],
  imports: [AuthModule, StatsModule],
})
export class WordsModule {}
