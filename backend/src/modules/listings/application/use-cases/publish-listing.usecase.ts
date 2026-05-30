// backend/src/modules/listings/application/use-cases/publish-listing.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

@Injectable()
export class PublishListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(listingId: number) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.publish();

    return this.listingRepository.update(
      listing.id,
      listing,
    );
  }
}