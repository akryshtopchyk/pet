import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  login(@Res() response, @Body() cred): boolean {
    if (cred.login === 'admin' && cred.password === 'password@!1') {
      return response.json(true);
    }
    return response.json(false);
  }
}
