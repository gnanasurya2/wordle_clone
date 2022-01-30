import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AuthService } from 'src/auth/auth.service';
import { Stats } from './stats.entity';
import { gameState } from '../constants/gameState';
import { getConnection } from 'typeorm';
@Injectable()
export class StatsService {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async fetchUser(token: string) {
    const user = await this.authService.decode(token);
    if (user) {
      const data = await this.findById(user['userId']);
      return {
        played: data.totalAttempts,
        winPercentage: data.totalAttempts
          ? Math.round((data.completed / data.totalAttempts) * 100)
          : 0,
        currentStreak: data.currentStreak,
        maxStreak: data.maxStreak,
        completed: data.completed,
        guessDistribution: data.guessDistribution,
      };
    } else {
      throw new HttpException('user not found', HttpStatus.FORBIDDEN);
    }
  }

  async update(id: string, isComplete: boolean, completedRow?: number) {
    const user = await this.findById(id);
    console.log('user', user, id);
    // Stats.update(id)
    let guessRow = [...user.guessDistribution],
      todayDate = new Date().getTime(),
      lastDate = new Date(user.lastCompletedDate).getTime(),
      diff = Math.floor((lastDate - todayDate) / (1000 * 24 * 60 * 60)),
      currentStreak = user.currentStreak;
    if (isComplete) {
      guessRow[completedRow + 1] = (+guessRow[completedRow + 1] + 1).toString();
      if (diff === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 0;
    }
    await getConnection()
      .createQueryBuilder()
      .update(Stats)
      .set({
        didNotFinish: () => (isComplete ? 'didNotFinish' : 'didNotFinish + 1'),
        guessDistribution: guessRow,
        totalAttempts: () => 'totalAttempts + 1',
        completed: () => (isComplete ? 'completed + 1' : 'completed'),
        currentStreak: currentStreak,
        maxStreak: Math.max(currentStreak, user.maxStreak),
        lastCompletedDate: isComplete
          ? new Date().toISOString().split('T')[0]
          : user.lastCompletedDate,
      })
      .where('userId = :id', { id: id })
      .execute();
    return { ...user };
  }

  async getGameState(token: string) {
    const user = await this.authService.decode(token);

    if (user) {
      let data: null | string = await this.cacheManager.get(user['userId']),
        todayDate = new Date().toISOString().split('T')[0];
      const response = {
        todayDate,
        gameState,
        currentRow: -1,
        isComplete: false,
      };
      if (data === null) {
        await this.cacheManager.set(
          user['userId'],
          JSON.stringify({ ...response, id: user['userId'] }),
        );
        return response;
      } else {
        const userState = JSON.parse(data);

        if (todayDate === userState.todayDate) {
          return {
            ...userState,
          };
        } else {
          await this.cacheManager.set(
            user['userId'],
            JSON.stringify({ ...response, id: user['userId'] }),
          );
          return response;
        }
      }
    }
  }

  async findById(id: string) {
    return await Stats.findOne({
      where: {
        userId: id,
      },
    });
  }
}
