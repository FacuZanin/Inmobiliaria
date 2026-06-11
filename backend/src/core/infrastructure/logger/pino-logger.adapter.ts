// backend/src/core/infrastructure/logger/pino-logger.adapter.ts
import { Injectable, LoggerService } from '@nestjs/common';
import type { ILogger } from '../../application/ports/logger.port';

// Adapter del ILogger port hacia NestJS LoggerService.
// Reemplazá el console.* con pino real:
//   import pino from 'pino';
//   private readonly logger = pino({ level: 'info' });
@Injectable()
export class PinoLoggerAdapter implements ILogger, LoggerService {
  log(message: string, context?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level: 'info', message, ...context }));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(JSON.stringify({ level: 'warn', message, ...context }));
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error?.message,
        stack: error?.stack,
        ...context,
      }),
    );
  }

  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(JSON.stringify({ level: 'debug', message, ...context }));
  }

  // Métodos de NestJS LoggerService (para usarlo como logger global de Nest)
  verbose(message: string): void {
    this.debug(message);
  }
}
