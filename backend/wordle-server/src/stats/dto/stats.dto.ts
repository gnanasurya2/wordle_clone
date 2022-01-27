import { IsNotEmpty } from 'class-validator';

export class createStatsDto {
  @IsNotEmpty()
  userId: number;

  totalAttempts?: number;

  completed?: number;

  failed?: number;

  didNotFinish?: number;

  currentStreak?: number;

  maxStreak?: number;

  guessDistribution?: [string, string, string, string, string, string];
}
