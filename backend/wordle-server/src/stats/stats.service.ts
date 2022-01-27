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

  async update(id: string) {
    const user = await this.findById(id);
    console.log('user', user, id);
    // Stats.update(id)
    return { ...user };
  }

  async getGameState(token: string) {
    const user = await this.authService.decode(token);

    if (user) {
      let data: null | string = await this.cacheManager.get(user['userId']),
        todayDate = new Date().toISOString().split('T')[0];

      if (data === null) {
        const response = {
          todayDate,
          gameState,
          currentRow: -1,
        };
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
          const response = {
            todayDate,
            gameState,
            currentRow: -1,
          };
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
