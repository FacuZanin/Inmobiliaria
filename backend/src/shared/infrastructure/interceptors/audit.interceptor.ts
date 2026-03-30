// backend\src\common\interceptors\audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { AUDIT_KEY } from '../../security/decorators/audit.decorator';
import { AuditService } from '../../../modules/audit/application/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const auditMeta = this.reflector.get(AUDIT_KEY, context.getHandler());
    if (!auditMeta) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const entityIdParam = auditMeta.entityIdParam ?? 'id';
    const entityId = request.params?.[entityIdParam];

    // Guardar estado ANTES
    let before = null;
    if (entityId && request.repo?.findById) {
      before = await request.repo.findById(+entityId);
    }

    return next.handle().pipe(
      tap(async (result) => {
        await this.auditService.log({
          action: auditMeta.action,
          entity: auditMeta.entity,
          entityId: entityId ? Number(entityId) : result?.id,
          userId: user?.id,
          oldValue: before,
          newValue: result,
        });
      }),
    );
  }
}
