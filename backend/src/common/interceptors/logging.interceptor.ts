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

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = req;

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          this.logger.log(
            `${method} ${url} → ${duration}ms\nParams: ${JSON.stringify(
              params,
            )}\nQuery: ${JSON.stringify(query)}\nBody: ${JSON.stringify(body)}`
          );
        },
        error: (err) => {
          const duration = Date.now() - start;
          this.logger.error(
            `${method} ${url} FAILED → ${duration}ms\nError: ${
              err?.message
            }\nStack: ${err?.stack}`
          );
        },
      }),
    );
  }
}
