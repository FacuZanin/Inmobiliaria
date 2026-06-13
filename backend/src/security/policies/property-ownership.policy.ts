// backend\src\core\security\policies\property-ownership.policy.ts

import { Injectable } from '@nestjs/common';

import { User }
from '@/modules/users/domain/entities/user.entity';

import { ListingAggregate }
from '@/modules/listings/domain/aggregates/listing.aggregate';

import { UserRole }
from '@shared/contracts/enums/user-role.enum';

@Injectable()
export class PropertyOwnershipPolicy {
  canManage(
    user: User,
    property: ListingAggregate,
  ): boolean {
    if (user.role === UserRole.SUPERADMIN) {
      return true;
    }

    if (property.ownerId === user.id) {
      return true;
    }

    if (
      property.agencyId &&
      property.agencyId === user.agencia?.id
    ) {
      return true;
    }

    return false;
  }

  canModify(
    user: User,
    property: ListingAggregate,
  ): boolean {
    return this.canManage(user, property);
  }

  canDelete(
    user: User,
    property: ListingAggregate,
  ): boolean {
    return this.canManage(user, property);
  }

  canViewPrivate(
    user: User,
    property: ListingAggregate,
  ): boolean {
    return this.canManage(user, property);
  }
}
