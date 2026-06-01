// backend/src/modules/listings/infrastructure/persistence/repositories/listing.repository.ts

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, SelectQueryBuilder } from 'typeorm';

import { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '../persistence/entities/listing.orm-entity';

import { ListingMapper } from '../mappers/listing.mapper';
import {
  ListingSearchFilters,
  PaginatedListingsResult,
} from '@modules/listings/domain/repositories/listing.repository.port';
import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';

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

  async update(
    id: number,
    aggregate: ListingAggregate,
  ): Promise<ListingAggregate> {
    const persistence = ListingMapper.toOrm(aggregate);
    const entity = this.repository.create({
      ...persistence,
      id,
    });

    await this.repository.save(entity);

    const updated = await this.findById(id);

    if (!updated) {
      throw new Error('Failed to reload listing after update');
    }

    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await this.delete(id);
  }

  async findByOwner(
    ownerId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedListingsResult> {
    return this.searchOwnerListings(ownerId, {
      page,
      limit,
    });
  }

  async findDraftsByOwner(ownerId: number): Promise<ListingAggregate[]> {
    const entities = await this.repository.find({
      where: {
        ownerId,
        status: ListingStatus.DRAFT,
      },
      relations: {
        media: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return entities.map((entity) => ListingMapper.toDomain(entity));
  }

  async findPendingModeration(
    pageOrFilters: number | ListingSearchFilters = 1,
    limit = 20,
  ): Promise<PaginatedListingsResult> {
    const filters =
      typeof pageOrFilters === 'number'
        ? { page: pageOrFilters, limit }
        : pageOrFilters;

    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.moderationStatus IN (:...statuses)', {
      statuses: [
        ModerationStatus.PENDING_REVIEW,
        ModerationStatus.UNDER_REVIEW,
        ModerationStatus.OBSERVED,
      ],
    });

    return this.executePaginatedQuery(qb, {
      page: filters.page,
      limit: filters.limit,
    });
  }

  async adminSearch(params: {
    query?: string;
    status?: string;
    moderationStatus?: string;
    ownerId?: number;
    page: number;
    limit: number;
  }): Promise<PaginatedListingsResult> {
    return this.searchAdmin({
      search: params.query,
      status: params.status as ListingStatus | undefined,
      moderationStatus:
        params.moderationStatus as ModerationStatus | undefined,
      ownerId: params.ownerId,
      page: params.page,
      limit: params.limit,
    });
  }

  async searchPublic(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.status = :status', {
      status: ListingStatus.ACTIVE,
    });
    qb.andWhere('listing.moderationStatus = :moderationStatus', {
      moderationStatus: ModerationStatus.APPROVED,
    });
    qb.andWhere('listing.visibility = :visibility', {
      visibility: ListingVisibility.PUBLIC,
    });

    return this.executePaginatedQuery(
      this.applyFilters(qb, filters),
      filters,
    );
  }

  async searchOwnerListings(
    ownerId: number,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.ownerId = :ownerId', {
      ownerId,
    });

    return this.executePaginatedQuery(
      this.applyFilters(qb, filters),
      filters,
    );
  }

  async searchAgencyListings(
    agencyId: number,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.agencyId = :agencyId', {
      agencyId,
    });

    return this.executePaginatedQuery(
      this.applyFilters(qb, filters),
      filters,
    );
  }

  async searchAdmin(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    return this.executePaginatedQuery(
      this.applyFilters(this.createBaseQueryBuilder(true), filters),
      filters,
    );
  }

  async findByModerationStatus(
    moderationStatus: ModerationStatus,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.moderationStatus = :moderationStatus', {
      moderationStatus,
    });

    return this.executePaginatedQuery(
      this.applyFilters(qb, filters),
      filters,
    );
  }

  private createBaseQueryBuilder(
    withDeleted = false,
  ): SelectQueryBuilder<ListingOrmEntity> {
    const qb = this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.media', 'media');

    if (withDeleted) {
      qb.withDeleted();
    }

    return qb;
  }

  private applyFilters(
    qb: SelectQueryBuilder<ListingOrmEntity>,
    filters: ListingSearchFilters,
  ): SelectQueryBuilder<ListingOrmEntity> {
    const search = filters.search ?? filters.query;

    if (search) {
      qb.andWhere(
        `(
          LOWER(listing.title) LIKE LOWER(:search)
          OR LOWER(listing.description) LIKE LOWER(:search)
          OR LOWER(listing.city) LIKE LOWER(:search)
        )`,
        { search: `%${search}%` },
      );
    }

    if (filters.propertyType) {
      qb.andWhere('listing.propertyType = :propertyType', {
        propertyType: filters.propertyType,
      });
    }

    if (filters.operationType) {
      qb.andWhere('listing.operationType = :operationType', {
        operationType: filters.operationType,
      });
    }

    if (filters.city) {
      qb.andWhere('LOWER(listing.city) LIKE LOWER(:city)', {
        city: `%${filters.city}%`,
      });
    }

    if (filters.minPrice != null) {
      qb.andWhere(
        '(listing.salePrice >= :minPrice OR listing.rentalPrice >= :minPrice)',
        { minPrice: filters.minPrice },
      );
    }

    if (filters.maxPrice != null) {
      qb.andWhere(
        '(listing.salePrice <= :maxPrice OR listing.rentalPrice <= :maxPrice)',
        { maxPrice: filters.maxPrice },
      );
    }

    if (filters.rooms != null) {
      qb.andWhere('listing.rooms >= :rooms', { rooms: filters.rooms });
    }

    if (filters.bedrooms != null) {
      qb.andWhere('listing.bedrooms >= :bedrooms', {
        bedrooms: filters.bedrooms,
      });
    }

    if (filters.bathrooms != null) {
      qb.andWhere('listing.bathrooms >= :bathrooms', {
        bathrooms: filters.bathrooms,
      });
    }

    if (filters.agencyId != null) {
      qb.andWhere('listing.agencyId = :agencyId', {
        agencyId: filters.agencyId,
      });
    }

    if (filters.ownerId != null) {
      qb.andWhere('listing.ownerId = :ownerId', {
        ownerId: filters.ownerId,
      });
    }

    if (filters.status) {
      qb.andWhere('listing.status = :status', { status: filters.status });
    }

    if (filters.moderationStatus) {
      qb.andWhere('listing.moderationStatus = :moderationStatus', {
        moderationStatus: filters.moderationStatus,
      });
    }

    if (filters.visibility) {
      qb.andWhere('listing.visibility = :visibility', {
        visibility: filters.visibility,
      });
    }

    return qb;
  }

  private async executePaginatedQuery(
    qb: SelectQueryBuilder<ListingOrmEntity>,
    filters: ListingSearchFilters,
  ): Promise<PaginatedListingsResult> {
    const page = Math.max(Number(filters.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit ?? 20), 1), 100);
    const allowedSorts = [
      'createdAt',
      'updatedAt',
      'salePrice',
      'rentalPrice',
      'viewsCount',
      'favoritesCount',
    ];
    const sortBy = allowedSorts.includes(filters.sortBy ?? '')
      ? filters.sortBy!
      : 'createdAt';
    const order = filters.order === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`listing.${sortBy}`, order);
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map((entity) => ListingMapper.toDomain(entity)),
      total,
      page,
      limit,
    };
  }
}
