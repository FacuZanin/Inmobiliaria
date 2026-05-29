import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { DOMAIN_EVENTS_QUEUE } from '@/shared/infrastructure/queues/queues.constants';
import type { PropertyPublishedPayload } from '../../domain/events/property-published.event';
import { PropertyPublishedHandler } from './property-published.handler';

type DomainEventJob<TPayload = unknown> = {
  name: string;
  aggregateId: string;
  occurredAt: string;
  payload: TPayload;
};

@Processor(DOMAIN_EVENTS_QUEUE)
export class DomainEventsProcessor extends WorkerHost {
  constructor(
    private readonly propertyPublishedHandler: PropertyPublishedHandler,
  ) {
    super();
  }

  async process(job: Job<DomainEventJob>): Promise<void> {
    if (job.name === 'property.published') {
      await this.propertyPublishedHandler.handle({
        name: 'property.published',
        aggregateId: job.data.aggregateId,
        occurredAt: new Date(job.data.occurredAt),
        payload: job.data.payload as PropertyPublishedPayload,
      });

      return;
    }

    throw new Error(`Unhandled domain event: ${job.name}`);
  }
}
