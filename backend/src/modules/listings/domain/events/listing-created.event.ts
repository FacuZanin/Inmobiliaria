import type { DomainEvent } from '@/shared/domain/events/domain-event';

export type ListingCreatedPayload = {
  listingId: number;
  ownerId: number;
  agencyId?: number | null;
  slug?: string | null;
};

export class ListingCreatedEvent
  implements DomainEvent<ListingCreatedPayload>
{
  readonly name = 'listing.created';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: ListingCreatedPayload) {
    this.aggregateId = String(payload.listingId);
  }
}
