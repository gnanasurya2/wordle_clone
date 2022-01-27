import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { Cache } from 'cache-manager';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
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
