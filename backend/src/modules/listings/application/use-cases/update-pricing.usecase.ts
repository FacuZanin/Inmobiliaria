// backend/src/modules/listings/application/use-cases/update-pricing.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

@Injectable()
export class UpdatePricingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    pricing: {
      salePrice?: number | null;
      rentalPrice?: number | null;
      expenses?: number | null;
    },
  ) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.updatePricing(pricing);

    return this.listingRepository.update(
      listingId,
      listing,
    );
  }
}
