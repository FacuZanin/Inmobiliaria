import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  PaginatedPropertiesResult,
  PropertyQueryRepositoryPort,
  PropertySearchFilters,
} from '../../domain/repositories/property-query.repository.port';
import { PropertyMapper } from '../mappers/property.mapper';
import { PropertyOrmEntity } from '../persistence/typeorm/entities/property.orm-entity';

@Injectable()
export class PropertyQueryRepository implements PropertyQueryRepositoryPort {
  constructor(
    @InjectRepository(PropertyOrmEntity)
    private readonly repository: Repository<PropertyOrmEntity>,
  ) {}

  async search(
    filters: PropertySearchFilters = {},
  ): Promise<PaginatedPropertiesResult> {
    const qb = this.repository.createQueryBuilder('property');

    this.applyFilters(qb, filters);
    this.applySorting(qb, filters);
    this.applyPagination(qb, filters);

    const [entities, total] = await qb.getManyAndCount();

    const page = Math.max(Number(filters.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit ?? 20), 1), 100);

    return {
      items: entities.map((entity) => PropertyMapper.toDomain(entity)),
      total,
      page,
      limit,
    };
  }

  private applyFilters(
    qb: SelectQueryBuilder<PropertyOrmEntity>,
    filters: PropertySearchFilters,
  ): void {
    if (filters.query?.trim()) {
      qb.andWhere(
        '(property.title ILIKE :query OR property.description ILIKE :query OR property.street ILIKE :query)',
        {
          query: `%${filters.query.trim()}%`,
        },
      );
    }

    if (filters.type) {
      qb.andWhere('property.type = :type', { type: filters.type });
    }

    if (filters.operationType) {
      qb.andWhere('property.operationType = :operationType', {
        operationType: filters.operationType,
      });
    }

    if (filters.status) {
      qb.andWhere('property.status = :status', { status: filters.status });
    }

    if (filters.visibility) {
      qb.andWhere('property.visibility = :visibility', {
        visibility: filters.visibility,
      });
    }

    if (filters.city?.trim()) {
      qb.andWhere('property.city ILIKE :city', {
        city: `%${filters.city.trim()}%`,
      });
    }

    if (filters.ownerId) {
      qb.andWhere('property.ownerId = :ownerId', {
        ownerId: filters.ownerId,
      });
    }

    if (filters.agencyId) {
      qb.andWhere('property.agencyId = :agencyId', {
        agencyId: filters.agencyId,
      });
    }

    if (filters.minPrice != null) {
      qb.andWhere(
        'COALESCE(property.salePrice, property.rentalPrice, 0) >= :minPrice',
        {
          minPrice: filters.minPrice,
        },
      );
    }

    if (filters.maxPrice != null) {
      qb.andWhere(
        'COALESCE(property.salePrice, property.rentalPrice, 0) <= :maxPrice',
        {
          maxPrice: filters.maxPrice,
        },
      );
    }
  }

  private applySorting(
    qb: SelectQueryBuilder<PropertyOrmEntity>,
    filters: PropertySearchFilters,
  ): void {
    const sortMap = {
      createdAt: 'property.createdAt',
      updatedAt: 'property.updatedAt',
      title: 'property.title',
      salePrice: 'property.salePrice',
      rentalPrice: 'property.rentalPrice',
    } as const;

    const sortBy = filters.sortBy ?? 'createdAt';
    const order = filters.order ?? 'DESC';

    qb.orderBy(sortMap[sortBy] ?? sortMap.createdAt, order);
  }

  private applyPagination(
    qb: SelectQueryBuilder<PropertyOrmEntity>,
    filters: PropertySearchFilters,
  ): void {
    const page = Math.max(Number(filters.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit ?? 20), 1), 100);

    qb.skip((page - 1) * limit);
    qb.take(limit);
  }
}
