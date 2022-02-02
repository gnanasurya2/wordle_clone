import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { state as gameState } from '../constants/gameState';
import { Cache } from 'cache-manager';
import { userStateType } from 'types';
@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.id,
    };
    return {
      access_token: this.authService.sign(payload),
    };
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

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { email, password } = authLoginDto;

    const user = await this.findByEmail(email);

    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = User.create(createUserDto);
      await user.save();

      delete user.password;
      return user;
    } catch (err) {
      console.log('error', err.sqlMessage, err);
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'email is already present',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);
    if (user) {
      delete user.password;
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findById(id: number) {
    return await User.findOne(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}
