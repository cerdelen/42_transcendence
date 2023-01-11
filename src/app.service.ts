import { Injectable, Render } from '@nestjs/common';

@Injectable()
export class AppService {
  @Render('example')
  getHello() {
    return ;
}
}