// backend\src\modules\listings\infrastructure\repositories\builders\listing-query.builder.ts
import { SelectQueryBuilder } from 'typeorm';

import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing.orm-entity';

import { ListingSearchFilters } from '@modules/listings/domain/repositories/listing-query.repository.port';

export class ListingQueryBuilder {
  static applyFilters(
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
        {
          search: `%${search}%`,
        },
      );
    }

    if (filters.propertyType) {
      qb.andWhere(
        'listing.propertyType = :propertyType',
        {
          propertyType: filters.propertyType,
        },
      );
    }

    if (filters.operationType) {
      qb.andWhere(
        'listing.operationType = :operationType',
        {
          operationType:
            filters.operationType,
        },
      );
    }

    if (filters.city) {
      qb.andWhere(
        'LOWER(listing.city) LIKE LOWER(:city)',
        {
          city: `%${filters.city}%`,
        },
      );
    }

    if (filters.minPrice != null) {
      qb.andWhere(
        `
        (
          listing.salePrice >= :minPrice
          OR listing.rentalPrice >= :minPrice
        )
        `,
        {
          minPrice: filters.minPrice,
        },
      );
    }

    if (filters.maxPrice != null) {
      qb.andWhere(
        `
        (
          listing.salePrice <= :maxPrice
          OR listing.rentalPrice <= :maxPrice
        )
        `,
        {
          maxPrice: filters.maxPrice,
        },
      );
    }

    if (filters.rooms != null) {
      qb.andWhere(
        'listing.rooms >= :rooms',
        {
          rooms: filters.rooms,
        },
      );
    }

    if (filters.bedrooms != null) {
      qb.andWhere(
        'listing.bedrooms >= :bedrooms',
        {
          bedrooms: filters.bedrooms,
        },
      );
    }

    if (filters.bathrooms != null) {
      qb.andWhere(
        'listing.bathrooms >= :bathrooms',
        {
          bathrooms: filters.bathrooms,
        },
      );
    }

    if (filters.agencyId != null) {
      qb.andWhere(
        'listing.agencyId = :agencyId',
        {
          agencyId: filters.agencyId,
        },
      );
    }

    if (filters.ownerId != null) {
      qb.andWhere(
        'listing.ownerId = :ownerId',
        {
          ownerId: filters.ownerId,
        },
      );
    }

    if (filters.status) {
      qb.andWhere(
        'listing.status = :status',
        {
          status: filters.status,
        },
      );
    }

    if (filters.moderationStatus) {
      qb.andWhere(
        'listing.moderationStatus = :moderationStatus',
        {
          moderationStatus:
            filters.moderationStatus,
        },
      );
    }

    if (filters.visibility) {
      qb.andWhere(
        'listing.visibility = :visibility',
        {
          visibility: filters.visibility,
        },
      );
    }

    return qb;
  }

  static applyPagination(
    qb: SelectQueryBuilder<ListingOrmEntity>,
    filters: ListingSearchFilters,
  ): void {
    const page = Math.max(
      Number(filters.page ?? 1),
      1,
    );

    const limit = Math.min(
      Math.max(
        Number(filters.limit ?? 20),
        1,
      ),
      100,
    );

    const allowedSorts = [
      'createdAt',
      'updatedAt',
      'salePrice',
      'rentalPrice',
      'viewsCount',
      'favoritesCount',
    ];

    const sortBy = allowedSorts.includes(
      filters.sortBy ?? '',
    )
      ? filters.sortBy!
      : 'createdAt';

    const order =
      filters.order === 'ASC'
        ? 'ASC'
        : 'DESC';

    qb.orderBy(
      `listing.${sortBy}`,
      order,
    );

    qb.skip((page - 1) * limit);

    qb.take(limit);
  }
}