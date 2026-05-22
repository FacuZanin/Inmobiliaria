// backend\src\shared\security\policies\user-ownership.policy.ts
import { Injectable } from '@nestjs/common';

import { User } from '@/modules/user/domain/entities/user.entity';

import { Permission } from '@shared/contracts/enums/permission.enum';

@Injectable()
export class UserOwnershipPolicy {
  canManage(
    currentUser: User,
    targetUser: User,
  ): boolean {
    if (
      currentUser.permissions?.includes(
        Permission.USER_MANAGE,
      )
    ) {
      return true;
    }

    return currentUser.id === targetUser.id;
  }

  canEditProfile(
    currentUser: User,
    targetUser: User,
  ): boolean {
    return this.canManage(
      currentUser,
      targetUser,
    );
  }

  canViewPrivateData(
    currentUser: User,
    targetUser: User,
  ): boolean {
    return this.canManage(
      currentUser,
      targetUser,
    );
  }
}