// backend/src/modules/listings/application/ports/listing-search.port.ts

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { OperationType } from '@modules/listings/domain/enums/operation-type.enum';
import { PropertyType } from '@modules/listings/domain/enums/property-type.enum';

export type SearchListingsFilters = {
  query?: string;

  city?: string;

  operationType?: OperationType;

  propertyType?: PropertyType;

  minPrice?: number;

  maxPrice?: number;

  bedrooms?: number;

  bathrooms?: number;

  status?: ListingStatus;

  limit?: number;

  page?: number;
};

export type SearchListingsResult = {
  data: ListingAggregate[];

  total: number;

  page: number;

  limit: number;
};

export interface ListingSearchPort {
  search(
    filters: SearchListingsFilters,
  ): Promise<SearchListingsResult>;
}