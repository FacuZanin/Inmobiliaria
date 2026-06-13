// backend\src\modules\documents\infrastructure\persistence\read\document-read.typeorm.repository.ts
import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { PaginatedResult } from '@/core/querying/pagination/paginated-result';

import {
  DocumentQueryRepositoryPort,
} from '@/modules/documents/application/queries/ports/document-query.repository';

import { DocumentListItemProjection } from '@/modules/documents/application/queries/projections/document-list-item.projection';

import { DocumentSortableFields } from '@/modules/documents/application/queries/contracts/document-query-fields';
import { FindDocumentsQueryParams } from '@/modules/documents/application/queries/contracts/find-documents.query-params';

import { DocumentOrmEntity } from '../typeorm/entities/document.orm-entity';

@Injectable()
export class DocumentReadTypeOrmRepository
  implements DocumentQueryRepositoryPort
{
  private readonly sortableFields: Record<
    DocumentSortableFields,
    string
  > = {
    createdAt: 'document.createdAt',
    status: 'document.status',
    type: 'document.type',
  };

  constructor(
    private readonly manager: EntityManager,
  ) {}

  async findMany(
    query: FindDocumentsQueryParams,
  ): Promise<PaginatedResult<DocumentListItemProjection>> {
    const qb = this.manager.createQueryBuilder(
      DocumentOrmEntity,
      'document',
    );

    qb.select([
      'document.id',
      'document.type',
      'document.status',
      'document.ownerId',
      'document.ownerType',
      'document.fileUrl',
      'document.reviewedBy',
      'document.reviewedAt',
      'document.createdAt',
    ]);

    if (query.status) {
      qb.andWhere(
        'document.status = :status',
        {
          status: query.status,
        },
      );
    }

    if (query.ownerId) {
      qb.andWhere(
        'document.ownerId = :ownerId',
        {
          ownerId: query.ownerId,
        },
      );
    }

    if (query.ownerType) {
      qb.andWhere(
        'document.ownerType = :ownerType',
        {
          ownerType: query.ownerType,
        },
      );
    }

    const sortField =
      this.sortableFields[
        query.sorting.field ?? query.sorting.sortBy ?? 'createdAt'
      ];

    const direction = String(
      query.sorting.direction ?? query.sorting.sortOrder ?? 'DESC',
    ).toUpperCase() as 'ASC' | 'DESC';

    qb.orderBy(
      sortField,
      direction,
    );

    const page = query.pagination.page ?? 1;
    const limit = query.pagination.limit ?? 20;

    qb.skip(
      (page - 1) * limit,
    );

    qb.take(limit);

    const [documents, total] =
      await qb.getManyAndCount();

    const projections: DocumentListItemProjection[] =
      documents.map((document) => ({
        id: document.id,
        type: document.type,
        status: document.status,
        ownerId: document.ownerId,
        ownerType: document.ownerType,
        fileUrl: document.fileUrl,
        reviewedBy: document.reviewedBy,
        reviewedAt: document.reviewedAt,
        createdAt: document.createdAt,
      }));

    return PaginatedResult.create(
      projections,
      total,
      page,
      limit,
    );
  }
}
