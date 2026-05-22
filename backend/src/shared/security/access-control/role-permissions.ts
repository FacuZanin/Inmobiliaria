// backend\src\shared\security\access-control\role-permissions.ts

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { Permission } from '@shared/contracts/enums/permission.enum';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPERADMIN]: [
    Permission.PROPERTY_CREATE,
    Permission.PROPERTY_UPDATE,
    Permission.PROPERTY_DELETE,

    Permission.PUBLICACION_APPROVE,
    Permission.PUBLICACION_REJECT,
    Permission.PUBLICACION_OBSERVE,
    Permission.PUBLICACION_PAUSE,

    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_RESTORE,

    Permission.USER_MANAGE,

    Permission.DOCUMENT_REVIEW,
    Permission.DOCUMENT_HISTORY,

    Permission.OPERATION_CREATE,
    Permission.OPERATION_UPDATE,
    Permission.OPERATION_DELETE,
    Permission.OPERATION_RESERVE,
    Permission.OPERATION_PROCESS,
    Permission.OPERATION_FINISH,
    Permission.OPERATION_CANCEL,
  ],

  [UserRole.MODERATOR]: [Permission.PUBLICACION_OBSERVE],

  [UserRole.USER]: [
    Permission.DOCUMENT_UPLOAD,
    Permission.OPERATION_CREATE,
    Permission.OPERATION_UPDATE,
    Permission.OPERATION_DELETE,
    Permission.OPERATION_RESERVE,
    Permission.OPERATION_PROCESS,
    Permission.OPERATION_FINISH,
    Permission.OPERATION_CANCEL,
  ],
};
