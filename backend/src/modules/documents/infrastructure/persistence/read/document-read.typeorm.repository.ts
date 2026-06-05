// backend\src\modules\documents\infrastructure\persistence\read\document-read.typeorm.repository.ts
import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { PaginatedResponseDto } from '@/core/application/dto/paginated-response.dto';

import {
  DocumentQueryRepositoryPort,
  FindDocumentsQuery,
} from '@/modules/documents/application/queries/ports/document-query.repository';

import { DocumentListItemProjection } from '@/modules/documents/application/queries/projections/document-list-item.projection';

import { DocumentOrmEntity } from '../typeorm/entities/document.orm-entity';

@Injectable()
export class DocumentReadTypeOrmRepository implements DocumentQueryRepositoryPort {
  constructor(private readonly manager: EntityManager) {}

  async findMany(
    query: FindDocumentsQuery,
  ): Promise<PaginatedResponseDto<DocumentListItemProjection>> {
    const qb = this.manager.createQueryBuilder(DocumentOrmEntity, 'document');

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
      qb.andWhere('document.status = :status', {
        status: query.status,
      });
    }

    if (query.ownerId) {
      qb.andWhere('document.ownerId = :ownerId', {
        ownerId: query.ownerId,
      });
    }

    if (query.ownerType) {
      qb.andWhere('document.ownerType = :ownerType', {
        ownerType: query.ownerType,
      });
    }

    const sortableFields: Array<keyof DocumentOrmEntity> = [
      'createdAt',
      'status',
      'type',
    ];

    const sortBy =
      query.sortBy &&
      sortableFields.includes(query.sortBy as keyof DocumentOrmEntity)
        ? query.sortBy
        : 'createdAt';

    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`document.${sortBy}`, sortOrder);

    qb.skip((query.page - 1) * query.limit);

    qb.take(query.limit);

    const [rows, total] = await qb.getManyAndCount();

    return new PaginatedResponseDto(
      rows.map((document) => ({
        id: document.id,
        type: document.type,
        status: document.status,
        ownerId: document.ownerId,
        ownerType: document.ownerType,
        fileUrl: document.fileUrl,
        reviewedBy: document.reviewedBy,
        reviewedAt: document.reviewedAt,
        createdAt: document.createdAt,
      })),
      total,
      query.page,
      query.limit,
    );
  }
}
