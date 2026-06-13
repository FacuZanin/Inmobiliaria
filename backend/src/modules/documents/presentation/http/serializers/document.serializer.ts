// backend\src\modules\documents\presentation\http\serializers\document.serializer.ts

import { DocumentListItemProjection } from '@modules/documents/application/queries/projections/document-list-item.projection';
import { PaginatedResult } from '@/core/querying/pagination/paginated-result';

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
    response: PaginatedResult<DocumentListItemProjection>,
  ) {
    return {
      data: response.data.map(this.serialize),
      meta: response.meta,
    };
  }
}
