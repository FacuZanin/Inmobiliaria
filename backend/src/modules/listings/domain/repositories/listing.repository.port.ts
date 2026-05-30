// backend\src\modules\listings\domain\repositories\listing.repository.port.ts

import type { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';
import { PropertyType } from '@modules/listings/domain/enums/property-type.enum';
import { OperationType } from '@modules/listings/domain/enums/operation-type.enum';

export type ListingSearchFilters = {
  search?: string;

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

  limit?: number;

  page?: number;

  sortBy?: string;

  order?: 'ASC' | 'DESC';
};

export type PaginatedListingsResult = {
  items: ListingAggregate[];

  total: number;
};

export interface ListingRepositoryPort {
  // =====================================================
  // WRITE
  // =====================================================

  save(
    listing: ListingAggregate,
  ): Promise<ListingAggregate>;

  update(
    id: number,
    listing: ListingAggregate,
  ): Promise<ListingAggregate | null>;

  softDelete(id: number): Promise<void>;

  // =====================================================
  // READ
  // =====================================================

  findById(
    id: number,
  ): Promise<ListingAggregate | null>;

  findBySlug(
    slug: string,
  ): Promise<ListingAggregate | null>;

  existsBySlug(slug: string): Promise<boolean>;

  // =====================================================
  // PUBLIC SEARCH
  // =====================================================

  searchPublic(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  // =====================================================
  // OWNER DASHBOARD
  // =====================================================

  searchOwnerListings(
    ownerId: number,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  // =====================================================
  // AGENCY DASHBOARD
  // =====================================================

  searchAgencyListings(
    agencyId: number,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  // =====================================================
  // ADMIN
  // =====================================================

  searchAdmin(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  // =====================================================
  // MODERATION
  // =====================================================

  findPendingModeration(
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  findByModerationStatus(
    moderationStatus: ModerationStatus,
    filters?: ListingSearchFilters,
  ): Promise<PaginatedListingsResult>;

  // =====================================================
  // ANALYTICS
  // =====================================================

  incrementViews(id: number): Promise<void>;

  incrementContacts(id: number): Promise<void>;

  syncFavoritesCount(
    listingId: number,
    count: number,
  ): Promise<void>;

  // =====================================================
  // COUNTERS
  // =====================================================

  countByOwner(ownerId: number): Promise<number>;

  countByAgency(
    agencyId: number,
  ): Promise<number>;
}