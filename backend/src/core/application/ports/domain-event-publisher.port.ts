// backend\src\core\application\ports\domain-event-publisher.port.ts
import type { DomainEvent } from '@/core/domain/events/domain-event';

export interface DomainEventPublisherPort {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
