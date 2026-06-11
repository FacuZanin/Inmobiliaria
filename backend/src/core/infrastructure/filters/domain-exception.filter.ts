// backend/src/core/infrastructure/filters/domain-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ValidationError } from '../../shared-kernel/errors/validation.error';
import { NotFoundError } from '../../shared-kernel/errors/not-found.error';
import { ConflictError } from '../../shared-kernel/errors/conflict.error';
import { UnauthorizedError } from '../../shared-kernel/errors/unauthorized.error';
import { BaseError } from '../../shared-kernel/errors/base.error';

const statusMap: Array<[new (...args: any[]) => BaseError, HttpStatus]> = [
  [ValidationError, HttpStatus.UNPROCESSABLE_ENTITY],
  [NotFoundError, HttpStatus.NOT_FOUND],
  [ConflictError, HttpStatus.CONFLICT],
  [UnauthorizedError, HttpStatus.UNAUTHORIZED],
];

@Catch(BaseError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = this.resolveStatus(exception);

    res.status(status).json({
      code: exception.code,
      message: exception.message,
      metadata: exception.metadata,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveStatus(error: BaseError): HttpStatus {
    for (const [ErrorClass, status] of statusMap) {
      if (error instanceof ErrorClass) return status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
