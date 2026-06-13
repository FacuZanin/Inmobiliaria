// backend\src\modules\documents\application\queries\queries\list-documents-by-owner.query.ts
import { PaginationParams } from '@/core/application/pagination/pagination-params';
import { SortingParams } from '@/core/querying/sorting/sorting-params';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

export type DocumentSortableFields =
  | 'createdAt'
  | 'status'
  | 'type';

export class ListDocumentsByOwnerQuery {
  constructor(
    readonly ownerId: number,
    readonly ownerType: DocumentOwnerType,
    readonly status: DocumentStatus | undefined,
    readonly pagination: PaginationParams,
    readonly sorting: SortingParams<DocumentSortableFields>,
  ) {}
}