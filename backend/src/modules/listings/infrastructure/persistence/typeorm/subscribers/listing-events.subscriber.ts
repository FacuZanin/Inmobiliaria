// backend\src\modules\listings\infrastructure\persistence\typeorm\subscribers\listing-events.subscriber.ts
import { Injectable } from '@nestjs/common';

import { AppLogger } from '@/core/shared/infrastructure/logger/logger.service';
import type { DomainEvent } from '@/core/shared/domain/events/domain-event';

@Injectable()
export class ListingEventsSubscriber {
  constructor(private readonly logger: AppLogger) {}

  async handle(event: DomainEvent): Promise<void> {
    this.logger.log(
      `Listing event handled: ${event.name} (${event.aggregateId})`,
      ListingEventsSubscriber.name,
    );
  }
}
