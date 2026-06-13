import type { DomainEvent } from '@/core/domain/events/domain-event.base';

export type ListingLocationChangedPayload = {
  listingId: number;
  address?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export class ListingLocationChangedEvent
  implements DomainEvent<ListingLocationChangedPayload>
{
  readonly name = 'listing.location.changed';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingLocationChangedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
