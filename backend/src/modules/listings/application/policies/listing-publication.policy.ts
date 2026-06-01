import { BadRequestException, Injectable } from '@nestjs/common';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';
import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';

@Injectable()
export class ListingPublicationPolicy {
  assertCanRequestPublication(listing: ListingAggregate): void {
    if (listing.status === ListingStatus.ARCHIVED) {
      throw new BadRequestException('Archived listings cannot be published');
    }

    if (listing.moderationStatus === ModerationStatus.REJECTED) {
      throw new BadRequestException(
        'Rejected listings must be updated before publishing',
      );
    }
  }
}
