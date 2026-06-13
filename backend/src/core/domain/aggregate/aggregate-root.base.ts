// backend/src/core/domain/aggregate/aggregate-root.base.ts
import { UniqueEntityId } from '../value-object/unique-entity-id.vo';
import type { DomainEvent } from '../events/domain-event.base';
import { Entity } from '../entity/entity.base';

export abstract class AggregateRoot<
  TId extends UniqueEntityId = UniqueEntityId,
  TProps extends Record<string, unknown> = Record<string, unknown>,
> extends Entity<TId, TProps> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(props?: TProps, id?: TId, createdAt?: Date) {
    const generatedId = UniqueEntityId.create();
    super(
      props ?? ({} as TProps),
      id ??
        (generatedId.ok
          ? (generatedId.value as TId)
          : (undefined as unknown as TId)),
      createdAt,
    );
  }

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
