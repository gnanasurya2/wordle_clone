import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateWordDto } from './words.dto';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Body() payload: CreateWordDto) {
    return this.wordsService.create(payload);
  }

  @Get(':word')
  updateFrequency(@Param('word') word: string) {
    return this.wordsService.update(word);
  }

  @Get('/find/:word')
  findWord(@Param('word') word: string) {
    return this.wordsService.findByWord(word);
  }

  @Post('/setDailyWordle')
  dailyWordle(@Body() { word }: CreateWordDto) {
    return this.wordsService.setDailyWordle(word);
  }

  @Post('/validateWord')
  validate(@Body() { word }: CreateWordDto) {
    return this.wordsService.findByWord(word);
  }
}
