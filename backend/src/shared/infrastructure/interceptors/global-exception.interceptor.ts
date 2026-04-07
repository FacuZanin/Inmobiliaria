// backend\src\common\interceptors\global-exception.interceptor.ts
/*import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const response = error.getResponse();
          const status = error.getStatus();

          const message =
            typeof response === 'string'
              ? response
              : (response as any)?.message ?? 'Error inesperado';

          return throwError(() => ({
            success: false,
            statusCode: status,
            message,
          }));
        }

        // Error no controlado
        return throwError(() => ({
          success: false,
          statusCode: 500,
          message: 'Error interno del servidor',
        }));
      }),
    );
  }
}
*/