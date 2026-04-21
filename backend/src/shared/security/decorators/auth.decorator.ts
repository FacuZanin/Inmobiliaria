// backend\src\common\decorators\auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '@shared/contracts/enums/user-role.enum';


export function Auth(...roles: UserRole[]) {
  if (roles.length === 0) {
    return applyDecorators(
      UseGuards( RolesGuard),
    );
  }

  return applyDecorators(
    Roles(...roles),
    UseGuards( RolesGuard),
  );
}
