// backend/src/core/application/event/event-handler.interface.ts
import type { IntegrationEvent } from './integration-event.base';

export interface IEventHandler<TEvent extends IntegrationEvent> {
  handle(event: TEvent): Promise<void>;
}
