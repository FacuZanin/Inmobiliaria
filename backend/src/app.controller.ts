// backend\src\app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Public } from './security/decorators/public.decorator';

@Controller()
export class AppController {

  @Get('health')
  @Public()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
