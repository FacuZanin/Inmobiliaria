import { Injectable } from '@nestjs/common';

import { ListingSearchMetadataService } from '@modules/listings/domain/services/listing-search-metadata.service';
import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

@Injectable()
export class ListingIndexingProcessor {
  constructor(
    private readonly searchMetadata: ListingSearchMetadataService,
  ) {}

  async index(listing: ListingAggregate): Promise<Record<string, unknown>> {
    return this.searchMetadata.build(listing);
  }
}
