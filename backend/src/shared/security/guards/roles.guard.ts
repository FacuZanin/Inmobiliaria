// backend\src\shared\security\guards\roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ 1. PUBLIC
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // ✅ 2. ROLES
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🔥 FIX CLAVE: si no hay roles → NO bloquear
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 🔥 recién ahora necesito user
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    // 🔐 validar roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Rol no autorizado');
    }

    return true;
  }
}