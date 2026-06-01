import { Injectable } from '@nestjs/common';

import { ListingAggregate } from '../aggregates/listing.aggregate';

@Injectable()
export class ListingSearchMetadataService {
  build(listing: ListingAggregate): Record<string, string | number | null> {
    return {
      id: listing.id,
      title: listing.title,
      city: listing.location.city,
      propertyType: listing.propertyType,
      operationType: listing.operationType,
      status: listing.status,
      moderationStatus: listing.moderationStatus,
      salePrice: listing.pricing.salePrice,
      rentalPrice: listing.pricing.rentalPrice,
    };
  }
}
