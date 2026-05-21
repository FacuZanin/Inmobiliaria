// backend\src\shared\security\decorators\auth.decorator.ts

import { applyDecorators, UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { Roles } from './roles.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { UserTypeGuard } from '../guards/user-type.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  const decorators = [
    ApiBearerAuth('access-token'),
    UseGuards(
      JwtAuthGuard,
      RolesGuard,
      UserTypeGuard,
    ),
  ];

  if (roles.length > 0) {
    decorators.push(Roles(...roles));
  }

  return applyDecorators(...decorators);
}