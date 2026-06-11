// backend/src/core/application/event/event-bus.interface.ts
import type { IntegrationEvent } from './integration-event.base';

export interface IEventBus {
  publish<TEvent extends IntegrationEvent>(event: TEvent): Promise<void>;
  publishAll<TEvent extends IntegrationEvent>(events: TEvent[]): Promise<void>;
}
