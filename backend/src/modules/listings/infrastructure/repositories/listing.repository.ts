// backend/src/modules/listings/infrastructure/persistence/repositories/listing.repository.ts

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '../entities/listing.orm-entity';

import { ListingMapper } from '../mappers/listing.mapper';

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

    const complete =
      await this.repository.findOne({
        where: {
          id: saved.id,
        },

        relations: {
          media: true,
        },
      });

    if (!complete) {
      throw new Error(
        'Failed to reload listing after save',
      );
    }

    return ListingMapper.toDomain(
      complete,
    );
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
}