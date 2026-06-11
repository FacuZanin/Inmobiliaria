// backend/src/core/domain/repository/repository.interface.ts
import type { AggregateRoot } from '../aggregate/aggregate-root.base';
import type { UniqueEntityId } from '../value-object/unique-entity-id.vo';
import type { Maybe } from '../../shared-kernel/types/maybe.type';

export interface IRepository<
  TAggregateRoot extends AggregateRoot<UniqueEntityId, any>,
> {
  findById(id: UniqueEntityId): Promise<Maybe<TAggregateRoot>>;
  save(entity: TAggregateRoot): Promise<void>;
  delete(entity: TAggregateRoot): Promise<void>;
}
