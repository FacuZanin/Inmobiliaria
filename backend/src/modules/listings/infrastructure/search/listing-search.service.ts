// backend/src/modules/listings/infrastructure/search/listing-search.service.ts

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import {
  ListingSearchPort,
  SearchListingsFilters,
  SearchListingsResult,
} from '@modules/listings/application/ports/listing-search.port';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';

import { ListingOrmEntity } from '../persistence/typeorm/entities/listing.orm-entity';

import { ListingMapper } from '../mappers/listing.mapper';

@Injectable()
export class ListingSearchService
  implements ListingSearchPort
{
  constructor(
    @InjectRepository(ListingOrmEntity)
    private readonly repository: Repository<ListingOrmEntity>,
  ) {}

  async search(
    filters: SearchListingsFilters,
  ): Promise<SearchListingsResult> {
    const query =
      this.repository.createQueryBuilder(
        'listing',
      );

    // =====================================================
    // RELATIONS
    // =====================================================

    query.leftJoinAndSelect(
      'listing.media',
      'media',
    );

    // =====================================================
    // ONLY ACTIVE
    // =====================================================

    query.andWhere(
      'listing.status = :status',
      {
        status: ListingStatus.ACTIVE,
      },
    );

    // =====================================================
    // TEXT SEARCH
    // =====================================================

    if (filters.query) {
      query.andWhere(
        `
        (
          listing.title ILIKE :query
          OR
          listing.description ILIKE :query
        )
        `,
        {
          query: `%${filters.query}%`,
        },
      );
    }

    // =====================================================
    // CITY
    // =====================================================

    if (filters.city) {
      query.andWhere(
        'listing.city ILIKE :city',
        {
          city: `%${filters.city}%`,
        },
      );
    }

    // =====================================================
    // OPERATION TYPE
    // =====================================================

    if (filters.operationType) {
      query.andWhere(
        'listing.operationType = :operationType',
        {
          operationType:
            filters.operationType,
        },
      );
    }

    // =====================================================
    // PROPERTY TYPE
    // =====================================================

    if (filters.propertyType) {
      query.andWhere(
        'listing.propertyType = :propertyType',
        {
          propertyType:
            filters.propertyType,
        },
      );
    }

    // =====================================================
    // MIN PRICE
    // =====================================================

    if (filters.minPrice != null) {
      query.andWhere(
        `
        (
          listing.salePrice >= :minPrice
          OR
          listing.rentalPrice >= :minPrice
        )
        `,
        {
          minPrice: filters.minPrice,
        },
      );
    }

    // =====================================================
    // MAX PRICE
    // =====================================================

    if (filters.maxPrice != null) {
      query.andWhere(
        `
        (
          listing.salePrice <= :maxPrice
          OR
          listing.rentalPrice <= :maxPrice
        )
        `,
        {
          maxPrice: filters.maxPrice,
        },
      );
    }

    // =====================================================
    // BEDROOMS
    // =====================================================

    if (filters.bedrooms != null) {
      query.andWhere(
        'listing.bedrooms >= :bedrooms',
        {
          bedrooms: filters.bedrooms,
        },
      );
    }

    // =====================================================
    // BATHROOMS
    // =====================================================

    if (filters.bathrooms != null) {
      query.andWhere(
        'listing.bathrooms >= :bathrooms',
        {
          bathrooms: filters.bathrooms,
        },
      );
    }

    // =====================================================
    // ORDER
    // =====================================================

    query.orderBy(
      'listing.createdAt',
      'DESC',
    );

    // =====================================================
    // PAGINATION
    // =====================================================

    const page = filters.page ?? 1;

    const limit = filters.limit ?? 20;

    query.skip((page - 1) * limit);

    query.take(limit);

    // =====================================================
    // EXECUTE
    // =====================================================

    const [entities, total] =
      await query.getManyAndCount();

    return {
      data: entities.map((entity) =>
        ListingMapper.toDomain(entity),
      ),

      total,

      page,

      limit,
    };
  }
}
