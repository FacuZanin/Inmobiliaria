// backend\src\core\security\decorators\auth.decorator.ts

import { applyDecorators, UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { Permission } from '@shared/contracts/enums/permission.enum';

import { Permissions } from './permissions.decorator';

import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';

import { AccessGuard } from '../guards/access.guard';
export function Auth(...permissions: Permission[]) {
  const decorators = [
    ApiBearerAuth('access-token'),

    UseGuards(JwtAuthGuard, AccessGuard),
  ];

  if (permissions.length > 0) {
    decorators.push(Permissions(...permissions));
  }

  return applyDecorators(...decorators);
}
