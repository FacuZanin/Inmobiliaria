// backend\src\core\infrastructure\events\in-memory-domain-event-publisher.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'node:events';

import type { DomainEventPublisherPort } from '@/core/application/ports/domain-event-publisher.port';
import type { DomainEvent } from '@/core/domain/events/domain-event';

@Injectable()
export class InMemoryDomainEventPublisher
  implements DomainEventPublisherPort
{
  private readonly emitter = new EventEmitter();

  async publish(event: DomainEvent): Promise<void> {
    this.emitter.emit(event.name, event);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  on<TEvent extends DomainEvent>(
    eventName: TEvent['name'],
    listener: (event: TEvent) => void | Promise<void>,
  ): void {
    this.emitter.on(eventName, listener);
  }
}
