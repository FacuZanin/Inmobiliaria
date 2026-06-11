// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\document-query.typeorm.repository.ts
import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { PaginatedResult } from '@/core/querying/pagination/paginated-result';

import { DocumentQueryRepositoryPort } from '@/modules/documents/application/queries/ports/document-query.repository';

import { DocumentListItemProjection } from '@/modules/documents/application/queries/projections/document-list-item.projection';

import { DocumentOrmEntity } from '../entities/document.orm-entity';

import { DocumentQueryMapper } from '@/modules/documents/infrastructure/mappers/document-query.mapper';

import {
  DOCUMENT_SORT_FIELDS,
  DOCUMENT_FILTER_FIELDS,
} from '@/modules/documents/application/queries/contracts/document-query-fields';

import { SafeSort } from '@/core/querying/sorting/safe-sort';
import { SafeFiltering } from '@/core/querying/filtering/safe-filtering';

import { FilterOperator } from '@/core/querying/filtering/filter-operator.enum';

import { FindDocumentsQueryParams } from '@/modules/documents/application/queries/contracts/find-documents.query-params';

@Injectable()
export class DocumentQueryTypeOrmRepository implements DocumentQueryRepositoryPort {
  constructor(private readonly manager: EntityManager) {}

  async findMany(
    params: FindDocumentsQueryParams,
  ): Promise<PaginatedResult<DocumentListItemProjection>> {
    const queryBuilder = this.manager.createQueryBuilder(
      DocumentOrmEntity,
      'document',
    );

    if (params.status) {
      queryBuilder.andWhere('document.status = :status', {
        status: params.status,
      });
    }

    if (params.ownerId) {
      queryBuilder.andWhere('document.ownerId = :ownerId', {
        ownerId: params.ownerId,
      });
    }

    if (params.ownerType) {
      queryBuilder.andWhere('document.ownerType = :ownerType', {
        ownerType: params.ownerType,
      });
    }

    if (params.filters && !params.filters.isEmpty()) {
      SafeFiltering.validateFields(
        params.filters.filters,
        DOCUMENT_FILTER_FIELDS,
      );

      for (const filter of params.filters.filters) {
        const parameterName = `filter_${filter.field}`;

        switch (filter.operator) {
          case FilterOperator.EQ:
            queryBuilder.andWhere(
              `document.${filter.field} = :${parameterName}`,
              {
                [parameterName]: filter.value,
              },
            );

            break;

          case FilterOperator.NEQ:
            queryBuilder.andWhere(
              `document.${filter.field} != :${parameterName}`,
              {
                [parameterName]: filter.value,
              },
            );

            break;

          default:
            break;
        }
      }
    }

    const sortField = SafeSort.resolve(
      params.sorting.field,
      DOCUMENT_SORT_FIELDS,
      'createdAt',
    );

    queryBuilder.orderBy(`document.${sortField}`, params.sorting.direction);

    queryBuilder.skip(params.pagination.offset);

    queryBuilder.take(params.pagination.limit);

    const [documents, total] = await queryBuilder.getManyAndCount();

    return PaginatedResult.create(
      documents.map(DocumentQueryMapper.toListItemProjection),

      total,

      params.pagination.page,

      params.pagination.limit,
    );
  }
}
