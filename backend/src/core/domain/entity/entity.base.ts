// backend/src/core/domain/entity/entity.base.ts
import type { UniqueEntityId } from '../value-object/unique-entity-id.vo';

export abstract class Entity<
  TId extends UniqueEntityId,
  TProps extends Record<string, unknown>,
> {
  protected readonly _id: TId;
  protected _props: TProps;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(props: TProps, id: TId, createdAt?: Date) {
    this._id = id;
    this._props = props;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = createdAt ?? new Date();
  }

  get id(): TId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  equals(other?: Entity<TId, TProps>): boolean {
    if (!other) return false;
    return this._id.equals(other._id);
  }
}
