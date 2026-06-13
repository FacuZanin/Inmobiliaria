import type { DomainEvent } from '@/core/domain/events/domain-event.base';

export type ListingDeletedPayload = {
  listingId: number;
  ownerId: number;
};

export class ListingDeletedEvent
  implements DomainEvent<ListingDeletedPayload>
{
  readonly name = 'listing.deleted';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingDeletedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
