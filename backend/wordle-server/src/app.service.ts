import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      name: 'gnansurya',
      testing: 'things are working fine',
    };
  }
}
