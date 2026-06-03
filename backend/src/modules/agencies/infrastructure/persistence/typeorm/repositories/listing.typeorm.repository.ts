// backend\src\modules\agencias\infrastructure\persistence\typeorm\repositories\listing.typeorm.repository.ts

import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import {
  ListingRepositoryPort,
  ListingSearchFilters,
  PaginatedListingsResult,
} from '@modules/listings/domain/repositories/listing.repository.port';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing.orm-entity';

import { ListingMapper } from '@modules/listings/infrastructure/mappers/listing.mapper';

import { LISTING_FULL_RELATIONS } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing-relations.constants';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';

@Injectable()
export class ListingTypeOrmRepository
  implements ListingRepositoryPort
{
  constructor(
    @InjectRepository(ListingOrmEntity)
    private readonly repo: Repository<ListingOrmEntity>,
  ) {}

  async save(
    listing: ListingAggregate,
  ): Promise<ListingAggregate> {
    try {
      const orm = this.repo.create(
        ListingMapper.toOrm(listing),
      );

      const saved = await this.repo.save(orm);

      const reloaded = await this.repo.findOne({
        where: {
          id: saved.id,
        },
        relations: [...LISTING_FULL_RELATIONS],
      });

      if (!reloaded) {
        throw new BadRequestException(
          'Listing could not be reloaded',
        );
      }

      return ListingMapper.toDomain(reloaded);
    } catch (error) {
      console.error(
        '[ListingTypeOrmRepository.save]',
        error,
      );

      throw new BadRequestException(
        'Error saving listing',
      );
    }
  }

  async update(
    id: number,
    listing: ListingAggregate,
  ): Promise<ListingAggregate> {
    try {
      const orm = this.repo.create({
        ...ListingMapper.toOrm(listing),
        id,
      });

      await this.repo.save(orm);

      const updated = await this.findById(id);

      if (!updated) {
        throw new BadRequestException(
          'Listing could not be reloaded',
        );
      }

      return updated;
    } catch (error) {
      console.error(
        '[ListingTypeOrmRepository.update]',
        error,
      );

      throw new BadRequestException(
        'Error updating listing',
      );
    }
  }

  async softDelete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async delete(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async findById(
    id: number,
  ): Promise<ListingAggregate | null> {
    const entity = await this.repo.findOne({
      where: {
        id,
      },
      relations: [...LISTING_FULL_RELATIONS],
    });

    if (!entity) {
      return null;
    }

    return ListingMapper.toDomain(entity);
  }

  async findBySlug(
    slug: string,
  ): Promise<ListingAggregate | null> {
    const entity = await this.repo.findOne({
      where: {
        slug,
      },
      relations: [...LISTING_FULL_RELATIONS],
    });

    if (!entity) {
      return null;
    }

    return ListingMapper.toDomain(entity);
  }

  async existsBySlug(
    slug: string,
  ): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        slug,
      },
    });

    return count > 0;
  }

  async searchPublic(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.deletedAt IS NULL');

    qb.andWhere(
      'listing.status = :status',
      {
        status: ListingStatus.ACTIVE,
      },
    );

    qb.andWhere(
      'listing.moderationStatus = :moderationStatus',
      {
        moderationStatus:
          ModerationStatus.APPROVED,
      },
    );

    qb.andWhere(
      'listing.visibility = :visibility',
      {
        visibility:
          ListingVisibility.PUBLIC,
      },
    );

    this.applyFilters(qb, filters);

    return this.executePaginatedQuery(qb);
  }

  async searchOwnerListings(
    ownerId: number,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.deletedAt IS NULL');

    qb.andWhere(
      'listing.ownerId = :ownerId',
      {
        ownerId,
      },
    );

    this.applyFilters(qb, filters);

    return this.executePaginatedQuery(qb);
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

  async findDraftsByOwner(
    ownerId: number,
  ): Promise<ListingAggregate[]> {
    const result = await this.searchOwnerListings(ownerId, {
      status: ListingStatus.DRAFT,
      page: 1,
      limit: 100,
    });

    return result.items;
  }

  async searchAgencyListings(
    agencyId: number,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere('listing.deletedAt IS NULL');

    qb.andWhere(
      'listing.agencyId = :agencyId',
      {
        agencyId,
      },
    );

    this.applyFilters(qb, filters);

    return this.executePaginatedQuery(qb);
  }

  async searchAdmin(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder({
      withDeleted: true,
    });

    this.applyFilters(qb, filters);

    return this.executePaginatedQuery(qb);
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

  async findPendingModeration(
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere(
      `
      listing.moderationStatus IN (
        :...statuses
      )
      `,
      {
        statuses: [
          ModerationStatus.PENDING_REVIEW,
          ModerationStatus.UNDER_REVIEW,
          ModerationStatus.OBSERVED,
        ],
      },
    );

    this.applyFilters(qb, filters);

    return this.executePaginatedQuery(qb);
  }

  async findByModerationStatus(
    moderationStatus: ModerationStatus,
    filters: ListingSearchFilters = {},
  ): Promise<PaginatedListingsResult> {
    const qb = this.createBaseQueryBuilder();

    qb.andWhere(
      'listing.moderationStatus = :moderationStatus',
      {
        moderationStatus,
      },
    );

    this.applyFilters(qb, filters);

    return this.executePaginatedQuery(qb);
  }

  async incrementViews(
    id: number,
  ): Promise<void> {
    await this.repo.increment(
      {
        id,
      },
      'viewsCount',
      1,
    );
  }

  async incrementContacts(
    id: number,
  ): Promise<void> {
    await this.repo.increment(
      {
        id,
      },
      'contactsCount',
      1,
    );
  }

  async syncFavoritesCount(
    listingId: number,
    count: number,
  ): Promise<void> {
    await this.repo.update(
      {
        id: listingId,
      },
      {
        favoritesCount: count,
      },
    );
  }

  async countByOwner(
    ownerId: number,
  ): Promise<number> {
    return this.repo.count({
      where: {
        ownerId,
      },
    });
  }

  async countByAgency(
    agencyId: number,
  ): Promise<number> {
    return this.repo.count({
      where: {
        agencyId,
      },
    });
  }

  private createBaseQueryBuilder(
    options?: {
      withDeleted?: boolean;
    },
  ): SelectQueryBuilder<ListingOrmEntity> {
    const qb = this.repo
      .createQueryBuilder('listing')
      .leftJoinAndSelect(
        'listing.owner',
        'owner',
      )
      .leftJoinAndSelect(
        'listing.agency',
        'agency',
      )
      .leftJoinAndSelect(
        'listing.media',
        'media',
      )
      .loadRelationCountAndMap(
        'listing.favoritesCount',
        'listing.favorites',
      );

    if (options?.withDeleted) {
      qb.withDeleted();
    }

    return qb;
  }

  private applyFilters(
    qb: SelectQueryBuilder<ListingOrmEntity>,
    filters: ListingSearchFilters,
  ) {
    const {
      search,
      propertyType,
      operationType,
      city,
      minPrice,
      maxPrice,
      rooms,
      bedrooms,
      bathrooms,
      agencyId,
      ownerId,
      status,
      moderationStatus,
      visibility,
    } = filters;

    if (search) {
      qb.andWhere(
        `
        (
          LOWER(listing.title)
            LIKE LOWER(:search)

          OR LOWER(listing.description)
            LIKE LOWER(:search)

          OR LOWER(listing.city)
            LIKE LOWER(:search)
        )
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    if (propertyType) {
      qb.andWhere(
        'listing.propertyType = :propertyType',
        {
          propertyType,
        },
      );
    }

    if (operationType) {
      qb.andWhere(
        'listing.operationType = :operationType',
        {
          operationType,
        },
      );
    }

    if (city) {
      qb.andWhere(
        `
        LOWER(listing.city)
        LIKE LOWER(:city)
        `,
        {
          city: `%${city}%`,
        },
      );
    }

    if (minPrice !== undefined) {
      qb.andWhere(
        `
        (
          listing.salePrice >= :minPrice
          OR listing.rentalPrice >= :minPrice
        )
        `,
        {
          minPrice,
        },
      );
    }

    if (maxPrice !== undefined) {
      qb.andWhere(
        `
        (
          listing.salePrice <= :maxPrice
          OR listing.rentalPrice <= :maxPrice
        )
        `,
        {
          maxPrice,
        },
      );
    }

    if (rooms !== undefined) {
      qb.andWhere(
        'listing.rooms = :rooms',
        {
          rooms,
        },
      );
    }

    if (bedrooms !== undefined) {
      qb.andWhere(
        'listing.bedrooms = :bedrooms',
        {
          bedrooms,
        },
      );
    }

    if (bathrooms !== undefined) {
      qb.andWhere(
        'listing.bathrooms = :bathrooms',
        {
          bathrooms,
        },
      );
    }

    if (agencyId !== undefined) {
      qb.andWhere(
        'listing.agencyId = :agencyId',
        {
          agencyId,
        },
      );
    }

    if (ownerId !== undefined) {
      qb.andWhere(
        'listing.ownerId = :ownerId',
        {
          ownerId,
        },
      );
    }

    if (status) {
      qb.andWhere(
        'listing.status = :status',
        {
          status,
        },
      );
    }

    if (moderationStatus) {
      qb.andWhere(
        `
        listing.moderationStatus =
        :moderationStatus
        `,
        {
          moderationStatus,
        },
      );
    }

    if (visibility) {
      qb.andWhere(
        'listing.visibility = :visibility',
        {
          visibility,
        },
      );
    }
  }

  private async executePaginatedQuery(
    qb: SelectQueryBuilder<ListingOrmEntity>,
  ): Promise<PaginatedListingsResult> {
    const rawLimit = Number(
      qb.expressionMap.parameters.limit ?? 20,
    );

    const rawPage = Number(
      qb.expressionMap.parameters.page ?? 1,
    );

    const limit = Math.min(rawLimit, 100);

    const page = Math.max(rawPage, 1);

    const sortBy =
      qb.expressionMap.parameters.sortBy ??
      'createdAt';

    const order =
      qb.expressionMap.parameters.order ??
      'DESC';

    const allowedSorts = [
      'createdAt',
      'updatedAt',
      'salePrice',
      'rentalPrice',
      'viewsCount',
      'favoritesCount',
    ];

    const safeSort = allowedSorts.includes(
      sortBy,
    )
      ? sortBy
      : 'createdAt';

    qb.orderBy(
      `listing.${safeSort}`,
      order,
    );

    qb.take(limit);

    qb.skip((page - 1) * limit);

    const [entities, total] =
      await qb.getManyAndCount();

    return {
      items: entities.map((entity) =>
        ListingMapper.toDomain(entity),
      ),
      total,
    };
  }
}
