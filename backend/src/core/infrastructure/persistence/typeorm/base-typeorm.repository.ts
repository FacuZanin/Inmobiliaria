// backend/src/core/infrastructure/persistence/typeorm/base-typeorm.repository.ts
import { Repository, FindOptionsWhere } from 'typeorm';
import type { AggregateRoot } from '../../../domain/aggregate/aggregate-root.base';
import type { UniqueEntityId } from '../../../domain/value-object/unique-entity-id.vo';
import type { IDomainEventPublisher } from '../../../domain/events/domain-event-publisher.interface';
import type { IRepository } from '../../../domain/repository/repository.interface';
import type { Maybe } from '../../../shared-kernel/types/maybe.type';
import type { TypeOrmEntityBase } from './typeorm-entity.base';

// Interface del mapper bidireccional dominio ↔ persistencia
export interface IMapper<TAggregate, TTypeOrmEntity> {
  toDomain(entity: TTypeOrmEntity): TAggregate;
  toPersistence(aggregate: TAggregate): TTypeOrmEntity;
}

export abstract class BaseTypeOrmRepository<
  TAggregate extends AggregateRoot<UniqueEntityId, any>,
  TTypeOrmEntity extends TypeOrmEntityBase,
> implements IRepository<TAggregate> {
  constructor(
    protected readonly ormRepo: Repository<TTypeOrmEntity>,
    protected readonly eventPublisher: IDomainEventPublisher,
    protected readonly mapper: IMapper<TAggregate, TTypeOrmEntity>,
  ) {}

  async findById(id: UniqueEntityId): Promise<Maybe<TAggregate>> {
    const entity = await this.ormRepo.findOne({
      where: { id: id.value } as FindOptionsWhere<TTypeOrmEntity>,
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async save(aggregate: TAggregate): Promise<void> {
    const entity = this.mapper.toPersistence(aggregate);
    await this.ormRepo.save(entity as any);

    // Publicar DESPUÉS del commit, nunca dentro de la transacción
    const events = aggregate.getDomainEvents();
    if (events.length > 0) {
      await this.eventPublisher.publish(events);
      aggregate.clearDomainEvents();
    }
  }

  async delete(aggregate: TAggregate): Promise<void> {
    const entity = this.mapper.toPersistence(aggregate);
    // softDelete si la entidad tiene deletedAt (TypeOrmEntityBase lo tiene)
    await this.ormRepo.softRemove(entity as any);

    const events = aggregate.getDomainEvents();
    if (events.length > 0) {
      await this.eventPublisher.publish(events);
      aggregate.clearDomainEvents();
    }
  }
}
