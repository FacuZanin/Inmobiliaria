import { Injectable } from '@nestjs/common';

import { AppLogger } from '@/shared/infrastructure/logger/logger.service';
import type { PropertyPublishedEvent } from '../../domain/events/property-published.event';

@Injectable()
export class PropertyPublishedHandler {
  constructor(private readonly logger: AppLogger) {}

  async handle(event: PropertyPublishedEvent): Promise<void> {
    this.logger.log(
      `Property published event processed: ${event.payload.propertyId}`,
      PropertyPublishedHandler.name,
    );
  }
}
