import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const response = error.getResponse();

          let message: string;

          if (typeof response === 'string') {
            message = response;
          } else if (Array.isArray((response as any).message)) {
            message = (response as any).message.join(', ');
          } else if (typeof response === 'object') {
            message = (response as any).message || 'Error inesperado';
          } else {
            message = 'Error inesperado';
          }

          return throwError(
            () =>
              new BadRequestException({
                status: error.getStatus(),
                message,
              }),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
