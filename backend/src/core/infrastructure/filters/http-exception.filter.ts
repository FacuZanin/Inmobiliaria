// backend/src/core/infrastructure/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

// Captura todas las HttpException y les da un formato de respuesta uniforme.
// Garantiza que TODOS los errores HTTP salgan con la misma estructura JSON.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    const response =
      typeof body === 'string' ? { code: 'HTTP_ERROR', message: body } : body;

    res.status(status).json({
      ...(response as object),
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
