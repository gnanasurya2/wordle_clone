import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@Headers('Authorization') token: string) {
    const userId = token.split(' ')[1];
    return this.statsService.fetchUser(userId);
  }

  @Post('/update')
  async update(
    @Body()
    {
      id,
      isComplete,
      completedRow,
    }: {
      id: string;
      isComplete: boolean;
      completedRow?: number;
    },
  ) {
    return await this.statsService.update(id, isComplete, completedRow);
  }
}
