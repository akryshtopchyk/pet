import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  login(@Res() response, @Body() cred): boolean {
    if (cred.login === 'admin' && cred.password === 'password@!') {
      return response.json(true);
    }
    return response.json(false);
  }
}
