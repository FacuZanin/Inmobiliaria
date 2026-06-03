// backend\src\core\security\access-control\role-permissions.ts

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { Permission } from '@shared/contracts/enums/permission.enum';

export const ROLE_PERMISSIONS: Record<
  UserRole,
  Permission[]
> = {
  [UserRole.SUPERADMIN]: [
    // LISTINGS
    Permission.LISTING_CREATE,
    Permission.LISTING_UPDATE,
    Permission.LISTING_DELETE,

    Permission.LISTING_PUBLISH,
    Permission.LISTING_PAUSE,
    Permission.LISTING_ARCHIVE,

    Permission.LISTING_READ_PRIVATE,

    Permission.LISTING_MODERATE,
    Permission.LISTING_APPROVE,
    Permission.LISTING_REJECT,

    Permission.LISTING_MEDIA_UPLOAD,
    Permission.LISTING_MEDIA_DELETE,

    // USERS
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_RESTORE,

    Permission.USER_MANAGE,

    // DOCUMENTS
    Permission.DOCUMENT_REVIEW,
    Permission.DOCUMENT_HISTORY,

    // OPERATIONS
    Permission.OPERATION_CREATE,
    Permission.OPERATION_UPDATE,
    Permission.OPERATION_DELETE,
    Permission.OPERATION_RESERVE,
    Permission.OPERATION_PROCESS,
    Permission.OPERATION_FINISH,
    Permission.OPERATION_CANCEL,
  ],

  [UserRole.MODERATOR]: [
    Permission.LISTING_MODERATE,
    Permission.LISTING_APPROVE,
    Permission.LISTING_REJECT,

    Permission.LISTING_READ_PRIVATE,
  ],

  [UserRole.USER]: [
    // LISTINGS
    Permission.LISTING_CREATE,
    Permission.LISTING_UPDATE,

    Permission.LISTING_PUBLISH,

    Permission.LISTING_MEDIA_UPLOAD,

    // FAVORITES
    Permission.FAVORITE_CREATE,

    // PROFILE
    Permission.PROFILE_UPDATE,

    // DOCUMENTS
    Permission.DOCUMENT_UPLOAD,

    // OPERATIONS
    Permission.OPERATION_CREATE,
    Permission.OPERATION_UPDATE,
    Permission.OPERATION_DELETE,
    Permission.OPERATION_RESERVE,
    Permission.OPERATION_PROCESS,
    Permission.OPERATION_FINISH,
    Permission.OPERATION_CANCEL,
  ],
};