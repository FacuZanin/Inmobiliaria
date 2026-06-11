// backend/src/core/domain/events/domain-event.base.ts
import { randomUUID } from 'crypto';

export abstract class DomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  abstract readonly eventName: string;

  constructor(aggregateId: string) {
    this.eventId = randomUUID();
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
  }
}
