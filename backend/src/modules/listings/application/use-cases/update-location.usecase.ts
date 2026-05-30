// backend/src/modules/listings/application/use-cases/update-location.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

@Injectable()
export class UpdateLocationUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    location: {
      address?: string;
      city?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.updateLocation(location);

    return this.listingRepository.update(
      listing.id,
      listing,
    );
  }
}