// backend/src/core/infrastructure/interceptors/timing.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// Agrega el header X-Response-Time a cada respuesta HTTP.
// Útil para detectar endpoints lentos en el portal inmobiliario
// (búsquedas con filtros geoespaciales, queries de listings, etc.).
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
      }),
    );
  }
}
