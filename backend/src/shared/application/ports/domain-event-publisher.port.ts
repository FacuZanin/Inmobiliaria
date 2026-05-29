import type { DomainEvent } from '@/shared/domain/events/domain-event';

export interface DomainEventPublisherPort {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
