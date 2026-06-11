// backend/src/core/domain/aggregate/aggregate-root.base.ts
import type { UniqueEntityId } from '../value-object/unique-entity-id.vo';
import type { DomainEvent } from '../events/domain-event.base';
import { Entity } from '../entity/entity.base';

export abstract class AggregateRoot<
  TId extends UniqueEntityId,
  TProps extends Record<string, unknown>,
> extends Entity<TId, TProps> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
