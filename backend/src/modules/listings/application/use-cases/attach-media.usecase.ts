// backend/src/modules/listings/application/use-cases/attach-media.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

@Injectable()
export class AttachMediaUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    media: {
      url: string;
      type: 'IMAGE' | 'VIDEO';
      isFeatured?: boolean;
    }[],
  ) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.attachMedia(media);

    return this.listingRepository.update(
      listing.id,
      listing,
    );
  }
}