// backend/src/core/infrastructure/interceptors/global-exception.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { ValidationError } from '../../shared-kernel/errors/validation.error';
import { NotFoundError } from '../../shared-kernel/errors/not-found.error';
import { ConflictError } from '../../shared-kernel/errors/conflict.error';
import { UnauthorizedError } from '../../shared-kernel/errors/unauthorized.error';
import type { BaseError } from '../../shared-kernel/errors/base.error';

// Convierte errores del dominio a HttpExceptions con el status correcto.
// Asegura que ningún detalle de implementación llegue al cliente.
@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        const httpError = this.mapDomainError(error);
        return throwError(() => httpError);
      }),
    );
  }

  private mapDomainError(error: unknown): HttpException {
    if (error instanceof ValidationError) {
      return new HttpException(
        this.buildBody(error, 'VALIDATION_ERROR'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (error instanceof NotFoundError) {
      return new HttpException(
        this.buildBody(error, 'NOT_FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }
    if (error instanceof ConflictError) {
      return new HttpException(
        this.buildBody(error, 'CONFLICT'),
        HttpStatus.CONFLICT,
      );
    }
    if (error instanceof UnauthorizedError) {
      return new HttpException(
        this.buildBody(error, 'UNAUTHORIZED'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Error desconocido — no exponer detalles al cliente
    console.error('[UnhandledError]', error);
    return new HttpException(
      { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private buildBody(error: BaseError, code: string): Record<string, unknown> {
    return {
      code,
      message: error.message,
      metadata: error.metadata ?? undefined,
    };
  }
}
