import type { DomainEvent } from '@/shared/domain/events/domain-event';

export type ListingMediaUpdatedPayload = {
  listingId: number;
  mediaIds: number[];
};

export class ListingMediaUpdatedEvent
  implements DomainEvent<ListingMediaUpdatedPayload>
{
  readonly name = 'listing.media.updated';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingMediaUpdatedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
