// backend/src/modules/listings/application/use-cases/search-listings.usecase.ts

import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  LISTING_SEARCH_SERVICE,
} from '@modules/listings/application/tokens';

import {
  ListingSearchPort,
  SearchListingsFilters,
} from '../ports/listing-search.port';

@Injectable()
export class SearchListingsUseCase {
  constructor(
    @Inject(LISTING_SEARCH_SERVICE)
    private readonly searchService: ListingSearchPort,
  ) {}

  async execute(
    filters: SearchListingsFilters,
  ) {
    return this.searchService.search(
      filters,
    );
  }
}