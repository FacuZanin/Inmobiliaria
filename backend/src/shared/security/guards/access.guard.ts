// backend\src\shared\security\guards\access.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Permission }
from '@shared/contracts/enums/permission.enum';

import { PERMISSIONS_KEY }
from '../decorators/permissions.decorator';

import { ROLE_PERMISSIONS }
from '../access-control/role-permissions';

@Injectable()
export class AccessGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<
        Permission[]
      >(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // endpoint sin permisos
    if (
      !requiredPermissions ||
      requiredPermissions.length === 0
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

    const permissions =
      ROLE_PERMISSIONS[user.role] || [];

    const hasPermissions =
      requiredPermissions.every(
        (permission) =>
          permissions.includes(permission),
      );

    if (!hasPermissions) {
      throw new ForbiddenException(
        'Permisos insuficientes',
      );
    }

    return true;
  }
}