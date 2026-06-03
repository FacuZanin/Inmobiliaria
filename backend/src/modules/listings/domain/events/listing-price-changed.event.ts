import type { DomainEvent } from '@/core/shared/domain/events/domain-event';

export type ListingPriceChangedPayload = {
  listingId: number;
  salePrice?: number | null;
  rentalPrice?: number | null;
  expenses?: number | null;
};

export class ListingPriceChangedEvent
  implements DomainEvent<ListingPriceChangedPayload>
{
  readonly name = 'listing.price.changed';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingPriceChangedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
