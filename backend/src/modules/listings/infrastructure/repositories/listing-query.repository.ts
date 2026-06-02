// backend\src\modules\listings\infrastructure\repositories\listing-query.repository.ts
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, SelectQueryBuilder } from 'typeorm';

import { ListingOrmEntity } from '@modules/listings/infrastructure/persistence/entities/listing.orm-entity';

import { ListingMapper } from '@modules/listings/infrastructure/mappers/listing.mapper';

import {
  ListingSearchFilters,
  PaginatedListingsResult,
} from '@modules/listings/domain/repositories/listing-query.repository.port';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';

import { ListingQueryBuilder } from './builders/listing-query.builder';

@Injectable()
export class ListingQueryRepository {
  constructor(
    @InjectRepository(ListingOrmEntity)
    private readonly repository: Repository<ListingOrmEntity>,
  ) {}

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
      ListingQueryBuilder.applyFilters(qb, filters),
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
      ListingQueryBuilder.applyFilters(qb, filters),
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
      ListingQueryBuilder.applyFilters(qb, filters),
      filters,
    );
  }

  async searchAdmin(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    return this.executePaginatedQuery(
      ListingQueryBuilder.applyFilters(
        this.createBaseQueryBuilder(true),
        filters,
      ),
      filters,
    );
  }

  async findPendingModeration(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.moderationStatus IN (:...statuses)', {
      statuses: [
        ModerationStatus.PENDING_REVIEW,
        ModerationStatus.UNDER_REVIEW,
        ModerationStatus.OBSERVED,
      ],
    });

    return this.executePaginatedQuery(
      ListingQueryBuilder.applyFilters(qb, filters),
      filters,
    );
  }

  async findDraftsByOwner(ownerId: number) {
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

  async findByModerationStatus(
    moderationStatus: ModerationStatus,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.moderationStatus = :moderationStatus', {
      moderationStatus,
    });

    return this.executePaginatedQuery(
      ListingQueryBuilder.applyFilters(qb, filters),
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

  private async executePaginatedQuery(
    qb: SelectQueryBuilder<ListingOrmEntity>,
    filters: ListingSearchFilters,
  ): Promise<PaginatedListingsResult> {
    ListingQueryBuilder.applyPagination(qb, filters);

    const page = Math.max(Number(filters.page ?? 1), 1);

    const limit = Math.min(Math.max(Number(filters.limit ?? 20), 1), 100);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map((entity) => ListingMapper.toDomain(entity)),

      total,

      page,

      limit,
    };
  }
}
