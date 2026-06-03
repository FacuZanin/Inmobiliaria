import type { DomainEvent } from '@/core/shared/domain/events/domain-event';

export type ListingPausedPayload = {
  listingId: number;
  ownerId: number;
};

export class ListingPausedEvent
  implements DomainEvent<ListingPausedPayload>
{
  readonly name = 'listing.paused';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingPausedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
