// backend/src/modules/listings/application/policies/listing-ownership.policy.ts

import { ForbiddenException } from '@nestjs/common';

import { JwtPayload } from '@modules/auth/application/contracts/jwt-payload.contracts';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

export class ListingOwnershipPolicy {
  static canModify(
    user: JwtPayload,
    listing: ListingAggregate,
  ): boolean {
    // SUPERADMIN bypass
    if (user.role === UserRole.SUPERADMIN) {
      return true;
    }

    // owner
    if (listing.ownerId === user.sub) {
      return true;
    }

    // agency ownership
    if (
      user.agencia?.id &&
      listing.agencyId &&
      user.agencia.id === listing.agencyId
    ) {
      return true;
    }

    return false;
  }

  static assertCanModify(
    user: JwtPayload,
    listing: ListingAggregate,
  ): void {
    const allowed = this.canModify(
      user,
      listing,
    );

    if (!allowed) {
      throw new ForbiddenException(
        'You do not have access to this listing',
      );
    }
  }
}