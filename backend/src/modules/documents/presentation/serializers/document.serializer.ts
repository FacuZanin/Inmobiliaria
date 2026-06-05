// backend\src\modules\documents\presentation\serializers\document.serializer.ts
import { PaginatedResponseDto } from '@/core/application/dto/paginated-response.dto';

import { DocumentListItemProjection } from '../../application/queries/projections/document-list-item.projection';

export class DocumentSerializer {
  static serialize(
    document: DocumentListItemProjection,
  ) {
    return {
      id: document.id,

      type: document.type,

      status: document.status,

      file: {
        url: document.fileUrl,
      },

      owner: {
        id: document.ownerId,
        type: document.ownerType,
      },

      review: {
        reviewedBy: document.reviewedBy,
        reviewedAt: document.reviewedAt,
      },

      createdAt: document.createdAt,
    };
  }

  static serializePaginated(
    response: PaginatedResponseDto<DocumentListItemProjection>,
  ) {
    return {
      data: response.data.map(this.serialize),
      meta: response.meta,
    };
  }
}