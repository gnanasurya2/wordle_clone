import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() creaUserDto: CreateUserDto) {
    return this.usersService.create(creaUserDto);
  }

  @Get('/state')
  async getUserState(@Headers('Authorization') token: string) {
    const userToken = token.split(' ')[1];
    console.log('inside');
    return await this.usersService.getGameState(userToken);
  }

  @Post('/login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.usersService.login(authLoginDto);
  }
}
