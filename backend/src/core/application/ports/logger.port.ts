// backend/src/core/application/ports/logger.port.ts
export interface ILogger {
  log(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

// Token de inyección para NestJS
export const LOGGER_PORT = Symbol('ILogger');
