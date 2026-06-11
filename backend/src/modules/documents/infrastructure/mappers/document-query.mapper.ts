// backend\src\modules\documents\infrastructure\mappers\document-query.mapper.ts
import { DocumentListItemProjection } from '@/modules/documents/application/queries/projections/document-list-item.projection';

import { DocumentOrmEntity } from '@/modules/documents/infrastructure/persistence/typeorm/entities/document.orm-entity';

export class DocumentQueryMapper {
  static toListItemProjection(
    orm: DocumentOrmEntity,
  ): DocumentListItemProjection {
    return {
      id: orm.id,

      type: orm.type,

      status: orm.status,

      ownerId: orm.ownerId,

      ownerType: orm.ownerType,

      fileUrl: orm.fileUrl,

      reviewedBy: orm.reviewedBy,

      reviewedAt: orm.reviewedAt,

      createdAt: orm.createdAt,
    };
  }
}