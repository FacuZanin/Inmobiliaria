// backend/src/core/infrastructure/events/in-memory-domain-event-publisher.ts
import { Injectable } from '@nestjs/common';
import type { DomainEvent } from '../../domain/events/domain-event.base';
import type { IDomainEventPublisher } from '../../domain/events/domain-event-publisher.interface';

// Implementación en memoria para desarrollo y testing.
// En producción se reemplaza por QueueDomainEventPublisher.
// Registrado como proveedor en CoreModule con un flag de entorno.
@Injectable()
export class InMemoryDomainEventPublisher implements IDomainEventPublisher {
  // Handlers registrados manualmente — útil para tests unitarios
  private readonly handlers = new Map<
    string,
    Array<(event: DomainEvent) => Promise<void>>
  >();

  register(
    eventName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): void {
    const existing = this.handlers.get(eventName) ?? [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventName = event.eventName ?? event.name;
      const eventHandlers = eventName ? (this.handlers.get(eventName) ?? []) : [];
      await Promise.all(eventHandlers.map((h) => h(event)));
    }
  }
}
