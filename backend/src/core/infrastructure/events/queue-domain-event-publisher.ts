// backend/src/core/infrastructure/events/queue-domain-event-publisher.ts
import { Injectable } from '@nestjs/common';
import type { DomainEvent } from '../../domain/events/domain-event.base';
import type { IDomainEventPublisher } from '../../domain/events/domain-event-publisher.interface';

// Puerto hacia el sistema de colas (BullMQ, RabbitMQ, etc.).
// La implementación concreta va en infrastructure/messaging/
// Este archivo es el adapter que implementa el puerto del dominio.
// En producción inyectá el cliente de BullMQ o amqplib aquí.
@Injectable()
export class QueueDomainEventPublisher implements IDomainEventPublisher {
  // Inyectá aquí el cliente de BullMQ: constructor(private readonly queue: Queue) {}
  // Por ahora loggea — reemplazá con la implementación real de tu broker.

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      // await this.queue.add(event.eventName, event);
      console.log(`[QueuePublisher] Publicando evento: ${event.eventName ?? event.name}`, {
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        occurredAt: event.occurredAt,
      });
    }
  }
}
