// backend\src\common\decorators\roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@shared/contracts';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
