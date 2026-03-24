// backend\src\common\guards\roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@shared/contracts';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🔥 1. Si no hay usuario → no autenticado
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    // 🔥 2. Si NO hay roles requeridos → permitir
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 🔥 3. Validar roles
    return requiredRoles.includes(user.role);
  }
}
