import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWordDto } from './words.dto';
import { WordsService } from './words.service';

@Controller('words')
@UseGuards(JwtAuthGuard)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get('/find/:word')
  findWord(@Param('word') word: string) {
    return this.wordsService.findByWord(word);
  }

  @Post('/setDailyWordle')
  dailyWordle(@Body() { word }: CreateWordDto) {
    return this.wordsService.setDailyWordle(word);
  }

  @Post('/validateWord')
  validate(
    @Body() { word, row }: { word: string; row: number },
    @Headers('Authorization') token: string,
  ) {
    const userToken = token.split(' ')[1];
    return this.wordsService.validateWord(word, row, userToken);
  }
}
