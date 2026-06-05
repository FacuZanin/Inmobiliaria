// backend\src\core\aggregates\aggregate-root.ts
import { DomainEvent } from '../events/domain-event';

export abstract class AggregateRoot {
  private readonly domainEvents: DomainEvent[] =
    [];

  protected addDomainEvent(
    event: DomainEvent,
  ): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];

    this.domainEvents.length = 0;

    return events;
  }
}