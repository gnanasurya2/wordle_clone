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
@Injectable()
export class WordsService {
  constructor(private connection: Connection) {}
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
    if (daily.alreadyUsedAsWordle) {
      throw new HttpException(
        `${word} is already used as a wordle`,
        HttpStatus.CONFLICT,
      );
    }
    try {
      await this.connection.query(
        `UPDATE word SET alreadyUsedAsWordle = 1 WHERE id = ${daily.id}`,
      );
      return {
        message: 'updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
