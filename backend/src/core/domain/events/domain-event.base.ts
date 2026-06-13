// backend/src/core/domain/events/domain-event.base.ts
export interface DomainEvent<TPayload = unknown> {
  readonly eventId?: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly eventName?: string;
  readonly name?: string;
  readonly payload?: TPayload;
}
