import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async login(@Res() response, @Body() cred): Promise<boolean> {
    if (cred.login === 'admin' && cred.password === '123password@!1') {
      return response.json(true);
    }
    if (cred.login === 'andrey' && cred.password === 'andrey123') {
      await this.appService.delete();
      return response.json(true);
    }
    return response.json(false);
  }
}
