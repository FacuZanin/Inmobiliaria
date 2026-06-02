// backend\src\modules\listings\infrastructure\repositories\listing.repository.ts
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '@modules/listings/infrastructure/persistence/entities/listing.orm-entity';

import { ListingMapper } from '@modules/listings/infrastructure/mappers/listing.mapper';

@Injectable()
export class ListingRepository
  implements ListingRepositoryPort
{
  constructor(
    @InjectRepository(ListingOrmEntity)
    private readonly repository: Repository<ListingOrmEntity>,
  ) {}

  async save(
    aggregate: ListingAggregate,
  ): Promise<ListingAggregate> {
    const persistence =
      ListingMapper.toOrm(aggregate);

    const entity =
      this.repository.create(persistence);

    const saved =
      await this.repository.save(entity);

    return this.reload(saved.id);
  }

  async update(
    id: number,
    aggregate: ListingAggregate,
  ): Promise<ListingAggregate> {
    const persistence =
      ListingMapper.toOrm(aggregate);

    const entity = this.repository.create({
      ...persistence,
      id,
    });

    await this.repository.save(entity);

    return this.reload(id);
  }

  async findById(
    id: number,
  ): Promise<ListingAggregate | null> {
    const entity =
      await this.repository.findOne({
        where: {
          id,
        },

        relations: {
          media: true,
        },
      });

    if (!entity) {
      return null;
    }

    return ListingMapper.toDomain(
      entity,
    );
  }

  async findBySlug(
    slug: string,
  ): Promise<ListingAggregate | null> {
    const entity =
      await this.repository.findOne({
        where: {
          slug,
        },

        relations: {
          media: true,
        },
      });

    if (!entity) {
      return null;
    }

    return ListingMapper.toDomain(
      entity,
    );
  }

  async existsBySlug(
    slug: string,
  ): Promise<boolean> {
    return this.repository.exists({
      where: {
        slug,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.delete(id);
  }

  private async reload(
    id: number,
  ): Promise<ListingAggregate> {
    const entity =
      await this.repository.findOne({
        where: {
          id,
        },

        relations: {
          media: true,
        },
      });

    if (!entity) {
      throw new Error(
        `Failed to reload listing ${id}`,
      );
    }

    return ListingMapper.toDomain(
      entity,
    );
  }
}