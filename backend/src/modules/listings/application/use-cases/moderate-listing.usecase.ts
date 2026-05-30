import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import { ModerationStatus } from '../../domain/enums/moderation-status.enum';

import { ListingRepositoryPort } from '../../domain/repositories/listing.repository.port';

@Injectable()
export class ModerateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly repository: ListingRepositoryPort,
  ) {}

  async execute(params: {
    listingId: number;
    approved: boolean;
    reason?: string;
  }) {
    const listing =
      await this.repository.findById(
        params.listingId,
      );

    if (!listing) {
      throw new NotFoundException(
        'Listing not found',
      );
    }

    if (params.approved) {
      listing.approveModeration();
    } else {
      listing.rejectModeration(
        params.reason ??
          'Rejected by moderation',
      );
    }

    return this.repository.save(listing);
  }
}