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
import { StatsService } from 'src/stats/stats.service';
@Injectable()
export class WordsService {
  constructor(
    private connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private statsService: StatsService,
  ) {}
  async create(payload: CreateWordDto) {
    const word = Word.create(payload);
    await word.save();
    return word;
  }

  async update(word: string) {
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

  async setDailyWordle(word: string) {
    const daily = await this.findByWord(word);
    try {
      //commented for dev purpose
      // await this.connection.query(
      //   `UPDATE word SET alreadyUsedAsWordle = 1 WHERE id = ${daily.id}`,
      // );
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

  async findGameState() {}
  async validateWord(word: string, row: number, token: string) {
    const wordsList = data.words;
    const isPresent = wordsList.includes(word);
    const userState = await this.statsService.getGameState(token);

    if (isPresent) {
      await this.update(word);
      let dailyWord: string | undefined = await this.cacheManager.get(
        'dailyWord',
      );
      console.log('word', word);
      if (!dailyWord) {
        try {
          let newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
          while (!(await this.canItbeADailyWordle(newWord))) {
            newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
          }
          await this.setDailyWordle(newWord);
          dailyWord = newWord;
        } catch (err) {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      const res = [];
      for (let i = 0; i < word.length; i++) {
        let state = 'absent';
        if (dailyWord.includes(word[i])) {
          if (dailyWord[i] === word[i]) {
            state = 'correct';
          } else {
            state = 'present';
          }
        }
        res.push([word[i], state]);
      }
      const newGameState = [...userState.gameState];
      newGameState[row] = res;
      await this.cacheManager.set(
        userState.id,
        JSON.stringify({
          ...userState,
          gameState: newGameState,
          currentRow: userState.currentRow + 1,
        }),
      );
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
