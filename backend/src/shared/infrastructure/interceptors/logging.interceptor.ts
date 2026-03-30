// backend\src\common\interceptors\logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = req;

    const safeBody = { ...body };
    if (safeBody?.password) safeBody.password = '***';

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `${method} ${url} - ${Date.now() - start}ms | body=${JSON.stringify(
              safeBody,
            )}`,
          );
        },
        error: (err) => {
          this.logger.error(
            `${method} ${url} FAILED - ${err?.message}`,
          );
        },
      }),
    );
  }
}

