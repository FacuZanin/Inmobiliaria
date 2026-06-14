import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import { ListingOwnershipPolicy } from '@/modules/listings/application/policies/listing-ownership.policy';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';

@Injectable()
export class ReorderListingMediaUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    items: { id: number; sortOrder: number }[],
    user: JwtPayload & { id?: number },
  ) {
    const listing = await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    ListingOwnershipPolicy.assertCanModify(user, listing);
    listing.reorderMedia(items);

    return this.listingRepository.update(listingId, listing);
  }
}
