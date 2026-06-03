// backend\src\core\infrastructure\events\queue-domain-event-publisher.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import type { DomainEventPublisherPort } from '@/core/application/ports/domain-event-publisher.port';
import type { DomainEvent } from '@/core/domain/events/domain-event';
import { DOMAIN_EVENTS_QUEUE } from '@/core/infrastructure/queues/queues.constants';

@Injectable()
export class QueueDomainEventPublisher implements DomainEventPublisherPort {
  constructor(
    @InjectQueue(DOMAIN_EVENTS_QUEUE)
    private readonly queue: Queue,
  ) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.queue.add(
      event.name,
      {
        name: event.name,
        aggregateId: event.aggregateId,
        occurredAt: event.occurredAt.toISOString(),
        payload: event.payload,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 1000,
        removeOnFail: false,
      },
    );
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
