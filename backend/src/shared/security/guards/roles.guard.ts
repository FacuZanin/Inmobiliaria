// backend/src/shared/security/guards/roles.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { ROLES_KEY } from '@/shared/security/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '@/shared/security/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }

    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (
      !requiredRoles ||
      requiredRoles.length === 0
    ) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'No autenticado',
      );
    }

    // SUPERADMIN bypass
    if (user.role === UserRole.SUPERADMIN) {
      return true;
    }

    const hasRole = requiredRoles.includes(
      user.role,
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'Rol no autorizado',
      );
    }

    return true;
  }
}