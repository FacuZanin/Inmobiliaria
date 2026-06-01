import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

export interface ListingCachePort {
  getById(id: number): Promise<ListingAggregate | null>;
  getBySlug(slug: string): Promise<ListingAggregate | null>;
  set(listing: ListingAggregate): Promise<void>;
  invalidate(id: number, slug?: string | null): Promise<void>;
}
