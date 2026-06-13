// backend\src\core\security\policies\publicacion-ownership.policy.ts

import { Injectable } from '@nestjs/common';

import { User }
from '@/modules/users/domain/entities/user.entity';

import { ListingAggregate }
from '@/modules/listings/domain/aggregates/listing.aggregate';

import { Permission }
from '@shared/contracts/enums/permission.enum';

@Injectable()
export class PublicacionOwnershipPolicy {
  canManage(
    user: User,
    property: ListingAggregate,
  ): boolean {
    if (
      user.permissions?.includes(
        Permission.PUBLICACION_APPROVE,
      )
    ) {
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

  canPause(
    user: User,
    property: ListingAggregate,
  ) {
    return this.canManage(
      user,
      property,
    );
  }

  canDelete(
    user: User,
    property: ListingAggregate,
  ) {
    return this.canManage(
      user,
      property,
    );
  }

  canEdit(
    user: User,
    property: ListingAggregate,
  ) {
    return this.canManage(
      user,
      property,
    );
  }
}
