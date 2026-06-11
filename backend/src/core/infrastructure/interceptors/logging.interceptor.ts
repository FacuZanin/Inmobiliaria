// backend/src/core/infrastructure/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    const meta = {
      method: req.method,
      path: req.url,
      userId: req.user?.id ?? 'anonymous',
      tenantId: req.user?.tenantId ?? null,
      ip: req.ip,
    };

    return next.handle().pipe(
      tap({
        next: () => {
          console.log('[HTTP]', {
            ...meta,
            duration: `${Date.now() - start}ms`,
            status: 'success',
          });
        },
        error: (err) => {
          console.error('[HTTP Error]', {
            ...meta,
            duration: `${Date.now() - start}ms`,
            error: err?.message,
          });
        },
      }),
    );
  }
}
