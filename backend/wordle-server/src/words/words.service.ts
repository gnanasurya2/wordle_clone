import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateWordDto } from './words.dto';
import { Word } from './words.entity';
import { Cache } from 'cache-manager';
import * as data from '../constants/wordlist.json';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { StatsService } from 'src/stats/stats.service';
import { state as gameState } from 'src/constants/gameState';
import { userStateType, possibleTileState } from 'types';

const MAX_ROW = 5;

@Injectable()
export class WordsService {
  constructor(
    private connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private authService: AuthService,
    private statsService: StatsService,
  ) {}
  async create(payload: CreateWordDto) {
    const word = Word.create(payload);
    await word.save();
    return word;
  }

  async updateFrequency(word: string) {
    try {
      const query = await this.connection.query(
        `UPDATE word SET frequency = frequency + 1 WHERE word = '${word}'`,
      );
      return {
        message: 'success',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findADailyWord() {
    const wordsList = data.words;
    try {
      let newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
      while (!(await this.canItbeADailyWordle(newWord))) {
        newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
      }
      await this.setDailyWordle(newWord);
      return newWord;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const dailyWord = await this.findADailyWord();
    await this.setDailyWordle(dailyWord);
    console.log('cron logging', dailyWord);
  }

  async setDailyWordle(word: string) {
    const daily = await this.findByWord(word);
    try {
      await this.connection.query(
        `UPDATE word SET alreadyUsedAsWordle = 1 WHERE id = ${daily.id}`,
      );
      await this.cacheManager.set('dailyWord', word, { ttl: 86400 });
      return {
        message: 'updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async canItbeADailyWordle(word: string) {
    const wordData = await this.findByWord(word);
    return !wordData.alreadyUsedAsWordle;
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
        id: user['userId'] as string,
      };
      if (data === null) {
        await this.cacheManager.set(
          user['userId'],
          JSON.stringify({ ...response, id: user['userId'] }),
        );
        return response;
      } else {
        const userState: userStateType = JSON.parse(data);

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

  async validateWord(word: string, row: number, token: string) {
    const wordsList = data.words;
    const isPresent = wordsList.includes(word);
    const userState = await this.getGameState(token);

    if (isPresent) {
      await this.updateFrequency(word);
      let dailyWord: string | undefined = await this.cacheManager.get(
        'dailyWord',
      );
      console.log('word', word);
      if (!dailyWord) {
        dailyWord = await this.findADailyWord();
        await this.setDailyWordle(dailyWord);
      }
      const res: { key: string; state: possibleTileState }[] = [];
      for (let i = 0; i < word.length; i++) {
        let state: possibleTileState = 'absent';
        if (dailyWord.includes(word[i])) {
          if (dailyWord[i] === word[i]) {
            state = 'correct';
          } else {
            state = 'present';
          }
        }
        res.push({ key: word[i], state });
      }
      const newGameState = { ...userState.gameState };
      newGameState.columns[row] = res;

      await this.cacheManager.set(
        userState.id,
        JSON.stringify({
          ...userState,
          gameState: newGameState,
          currentRow: userState.currentRow + 1,
        }),
      );
      //change the stats table to make it more clear
      if (word === dailyWord) {
        this.statsService.update(userState.id, true, row);
      } else if (row === MAX_ROW) {
        this.statsService.update(userState.id, false);
      }
      return {
        isPresent,
        word,
        res,
        isComplete: word === dailyWord,
      };
    }
    return {
      isPresent,
    };
  }
  async findByWord(word: string) {
    const res = await Word.findOne({
      where: {
        word: word,
      },
    });
    if (res) {
      return res;
    }
    throw new HttpException('word not found', HttpStatus.NOT_FOUND);
  }
}
