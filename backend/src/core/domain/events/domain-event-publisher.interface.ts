// backend/src/core/domain/events/domain-event-publisher.interface.ts
import type { DomainEvent } from './domain-event.base';

export interface IDomainEventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}
