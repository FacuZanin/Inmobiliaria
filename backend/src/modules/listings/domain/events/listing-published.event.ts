import type { DomainEvent } from '@/core/shared/domain/events/domain-event';

export type ListingPublishedPayload = {
  listingId: number;
  ownerId: number;
  slug?: string | null;
};

export class ListingPublishedEvent
  implements DomainEvent<ListingPublishedPayload>
{
  readonly name = 'listing.published';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingPublishedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
