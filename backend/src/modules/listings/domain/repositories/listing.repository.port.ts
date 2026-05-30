// backend/src/modules/listings/domain/repositories/listing.repository.port.ts

import { ListingAggregate } from '../aggregates/listing.aggregate';

export abstract class ListingRepositoryPort {
  abstract save(
    listing: ListingAggregate,
  ): Promise<ListingAggregate>;

  abstract findById(
    id: number,
  ): Promise<ListingAggregate | null>;

  abstract findBySlug(
    slug: string,
  ): Promise<ListingAggregate | null>;

  abstract existsBySlug(
    slug: string,
  ): Promise<boolean>;

  abstract delete(
    id: number,
  ): Promise<void>;
}