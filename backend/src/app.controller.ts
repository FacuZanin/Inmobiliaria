// backend\src\app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Public } from './core/security/decorators/public.decorator';

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
