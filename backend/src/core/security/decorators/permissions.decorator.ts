// backend\src\core\security\decorators\permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

import { Permission } from '@shared/contracts/enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (
  ...permissions: Permission[]
) => SetMetadata(PERMISSIONS_KEY, permissions);