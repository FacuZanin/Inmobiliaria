// backend/src/modules/listings/application/use-cases/moderate-listing.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';

@Injectable()
export class ModerateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async approve(listingId: number) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.approveModeration();

    return this.listingRepository.update(
      listing.id,
      listing,
    );
  }

  async reject(
    listingId: number,
    reason: string,
  ) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.rejectModeration(reason);

    return this.listingRepository.update(
      listing.id,
      listing,
    );
  }
}