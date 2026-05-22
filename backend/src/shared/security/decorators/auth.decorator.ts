// backend/src/shared/security/decorators/auth.decorator.ts

import {
  applyDecorators,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { Roles } from './roles.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { RolesGuard } from '../guards/roles.guard';
import { UserTypeGuard } from '../guards/user-type.guard';

export function Auth(...roles: UserRole[]) {
  const decorators = [
    ApiBearerAuth('access-token'),

    UseGuards(
      RolesGuard,
      UserTypeGuard,
    ),
  ];

  if (roles.length > 0) {
    decorators.push(Roles(...roles));
  }

  return applyDecorators(...decorators);
}