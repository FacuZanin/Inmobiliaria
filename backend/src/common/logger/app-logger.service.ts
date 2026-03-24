// backend\src\common\logger\app-logger.service.ts
import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {

  log(message: string, context?: string) {
    super.log(this.format(message), context);
  }

  warn(message: string, context?: string) {
    super.warn(this.format(message), context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(this.format(message), stack, context);
  }

  private format(message: string) {
    return `[${new Date().toISOString()}] ${message}`;
  }
}
