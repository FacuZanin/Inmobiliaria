// backend/src/core/infrastructure/interceptors/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';

// Decorador para marcar endpoints que requieren auditoría
export const AUDITABLE_KEY = 'auditable';
export const Auditable =
  (action?: string) =>
  (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      AUDITABLE_KEY,
      action ?? key.toString(),
      descriptor.value,
    );
    return descriptor;
  };

// Persiste un registro de auditoría para operaciones sensibles:
// publicar/despublicar listings, cambios de precio, eliminaciones,
// cambios de suscripción, acciones administrativas.
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const action = this.reflector.get<string>(
      AUDITABLE_KEY,
      context.getHandler(),
    );

    // Si el endpoint no tiene @Auditable(), no hacemos nada
    if (!action) return next.handle();

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id ?? 'anonymous';

    return next.handle().pipe(
      tap({
        next: () => {
          // Reemplazar con persistencia real en audit_logs table
          console.log('[AUDIT]', {
            action,
            userId,
            ip: req.ip,
            method: req.method,
            path: req.url,
            occurredAt: new Date().toISOString(),
            status: 'success',
          });
        },
        error: (err) => {
          console.log('[AUDIT]', {
            action,
            userId,
            ip: req.ip,
            method: req.method,
            path: req.url,
            occurredAt: new Date().toISOString(),
            status: 'failure',
            error: err?.message,
          });
        },
      }),
    );
  }
}
