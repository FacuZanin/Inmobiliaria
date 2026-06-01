import { Injectable } from '@nestjs/common';

import { AppLogger } from '@/shared/infrastructure/logger/logger.service';
import type { DomainEvent } from '@/shared/domain/events/domain-event';

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
