// backend/src/core/application/event/integration-event.base.ts
import { randomUUID } from 'crypto';

// IntegrationEvent: cruza bounded contexts o sale al exterior (queue, webhook).
// Diferente al DomainEvent (interno al agregado).
// Ejemplo: ListingPublishedIntegrationEvent → notifica al módulo de search,
//          al módulo de notificaciones, a servicios externos de ML.
export abstract class IntegrationEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly source: string;
  abstract readonly eventName: string;
  abstract readonly version: number;

  constructor(source: string) {
    this.eventId = randomUUID();
    this.occurredAt = new Date();
    this.source = source;
  }
}
