import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@shared/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ 1. PRIMERO: verificar si es público
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // ✅ 2. Obtener roles requeridos
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ✅ 3. Si no hay usuario → no autenticado
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    // ✅ 4. Si no hay roles requeridos → permitir
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // ✅ 5. Validar roles
    return requiredRoles.includes(user.role);
  }
}console.log('RolesGuard ejecutándose');