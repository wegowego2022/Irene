import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('wgwg Server hello world!!');
    return 'wgwg Server hello world!!';
  }
}
