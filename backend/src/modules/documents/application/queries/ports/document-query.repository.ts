// backend\src\modules\documents\application\queries\ports\document-query.repository.ts
import { PaginatedResult } from '@/core/querying/pagination/paginated-result';

import { DocumentListItemProjection } from '../projections/document-list-item.projection';

import { FindDocumentsQueryParams } from '../contracts/find-documents.query-params';

export interface DocumentQueryRepositoryPort {
  findMany(
    params: FindDocumentsQueryParams,
  ): Promise<PaginatedResult<DocumentListItemProjection>>;
}
