import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../enums/user-role.enum';


export function Auth(...roles: UserRole[]) {
  if (roles.length === 0) {
    return applyDecorators(
      UseGuards(JwtAuthGuard, RolesGuard),
    );
  }

  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
