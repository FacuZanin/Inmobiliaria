import { DomainEvent } from '@/core/domain/events/domain-event.base';

export type VisitEventPayload = {
  visitId: number | null;
  listingId: number;
  propertyId: number | null;
  requesterId: number;
  ownerId: number;
  agencyId: number | null;
};

export function createVisitEvent(
  eventName: string,
  payload: VisitEventPayload,
): DomainEvent<VisitEventPayload> {
  return {
    aggregateId: String(payload.visitId ?? payload.listingId),
    occurredAt: new Date(),
    eventName,
    payload,
  };
}
