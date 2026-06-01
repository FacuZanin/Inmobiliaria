// backend/src/modules/listings/domain/repositories/listing.repository.port.ts

import { ListingAggregate } from '../aggregates/listing.aggregate';
import { ListingStatus } from '../enums/listing-status.enum';
import { ListingVisibility } from '../enums/listing-visibility.enum';
import { ModerationStatus } from '../enums/moderation-status.enum';
import { OperationType } from '../enums/operation-type.enum';
import { PropertyType } from '../enums/property-type.enum';

export type ListingSearchFilters = {
  search?: string;
  query?: string;
  propertyType?: PropertyType;
  operationType?: OperationType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  agencyId?: number;
  ownerId?: number;
  status?: ListingStatus;
  moderationStatus?: ModerationStatus;
  visibility?: ListingVisibility;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
};

export type PaginatedListingsResult = {
  items: ListingAggregate[];
  total: number;
  page?: number;
  limit?: number;
};

export abstract class ListingRepositoryPort {
  abstract save(
    listing: ListingAggregate,
  ): Promise<ListingAggregate>;

  abstract update(
    id: number,
    listing: ListingAggregate,
  ): Promise<ListingAggregate>;

  abstract softDelete?(id: number): Promise<void>;

  abstract findById(
    id: number,
  ): Promise<ListingAggregate | null>;

  abstract findBySlug(
    slug: string,
  ): Promise<ListingAggregate | null>;

  abstract existsBySlug(
    slug: string,
  ): Promise<boolean>;

  findByOwner(
    ownerId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedListingsResult> {
    throw new Error('findByOwner not implemented');
  }

  findDraftsByOwner(
    ownerId: number,
  ): Promise<ListingAggregate[]> {
    throw new Error('findDraftsByOwner not implemented');
  }

  abstract findPendingModeration(
    pageOrFilters?: number | ListingSearchFilters,
    limit?: number,
  ): Promise<PaginatedListingsResult>;

  adminSearch(params: {
    query?: string;
    status?: string;
    moderationStatus?: string;
    ownerId?: number;
    page: number;
    limit: number;
  }): Promise<PaginatedListingsResult> {
    throw new Error('adminSearch not implemented');
  }

  searchPublic?(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  searchOwnerListings?(
    ownerId: number,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  searchAgencyListings?(
    agencyId: number,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  searchAdmin?(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  findByModerationStatus?(
    moderationStatus: ModerationStatus,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  delete(id: number): Promise<void> {
    throw new Error('delete not implemented');
  }
}
