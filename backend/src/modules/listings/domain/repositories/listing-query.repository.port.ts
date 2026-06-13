// backend/src/modules/listings/domain/repositories/listing-query.repository.port.ts
import { ListingAggregate } from '../aggregates/listing.aggregate';

import { ListingStatus } from '../enums/listing-status.enum';
import { ModerationStatus } from '../enums/moderation-status.enum';
import { ListingVisibility } from '../enums/listing-visibility.enum';
import { OperationType } from '../enums/operation-type.enum';
import { PropertyType } from '../enums/property-type.enum';

export interface ListingSearchFilters {
  query?: string;

  search?: string;

  propertyType?: PropertyType;

  operationType?: OperationType;

  city?: string;

  minPrice?: number;

  maxPrice?: number;

  rooms?: number;

  bedrooms?: number;

  bathrooms?: number;

  ownerId?: number;

  agencyId?: number;

  status?: ListingStatus;

  moderationStatus?: ModerationStatus;

  visibility?: ListingVisibility;

  page?: number;

  limit?: number;

  sortBy?: string;

  order?: 'ASC' | 'DESC';
}

export interface PaginatedListingsResult {
  items: ListingAggregate[];

  total: number;

  page: number;

  limit: number;
}

export interface ListingQueryRepositoryPort {
  searchPublic(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  searchOwnerListings(
    ownerId: number,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  searchAgencyListings(
    agencyId: number,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  searchAdmin(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  findPendingModeration(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  findDraftsByOwner(
    ownerId: number,
  ): Promise<ListingAggregate[]>;

  findByModerationStatus(
    moderationStatus: ModerationStatus,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;
}