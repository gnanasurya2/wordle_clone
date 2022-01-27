import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [AuthModule],
  exports: [StatsService],
})
export class StatsModule {}
