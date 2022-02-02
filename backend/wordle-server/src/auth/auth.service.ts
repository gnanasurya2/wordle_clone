import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async decode(token: string) {
    return this.jwtService.decode(token);
  }

  sign(token: { userId: number }) {
    return this.jwtService.sign(token);
  }
}
