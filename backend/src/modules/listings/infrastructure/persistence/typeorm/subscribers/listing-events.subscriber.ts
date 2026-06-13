// backend\src\modules\listings\infrastructure\persistence\typeorm\subscribers\listing-events.subscriber.ts
import { Inject, Injectable } from '@nestjs/common';

import { LOGGER } from '@/core/application/ports/logger.token';
import type { ILogger } from '@/core/application/ports/logger.port';
import type { DomainEvent } from '@/core/domain/events/domain-event.base';

@Injectable()
export class ListingEventsSubscriber {
  constructor(
    @Inject(LOGGER)
    private readonly logger: ILogger,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    this.logger.log(
      `Listing event handled: ${(event.eventName ?? event.name) ?? 'unknown'} (${event.aggregateId})`,
      { context: ListingEventsSubscriber.name },
    );
  }
}
