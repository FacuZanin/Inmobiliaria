// backend\src\modules\documents\application\queries\queries\get-documents-by-status.query.ts
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

import { PaginationParams } from '@/core/querying/pagination/pagination-params';

import { SortingParams } from '@/core/querying/sorting/sorting-params';

import { FilterGroup } from '@/core/querying/filtering/nodes/filter-group';

import {
  DocumentFilterFields,
  DocumentSortableFields,
} from '../contracts/document-query-fields';

export class GetDocumentsByStatusQuery {
  constructor(
    readonly status: DocumentStatus,

    readonly pagination: PaginationParams,

    readonly sorting: SortingParams<DocumentSortableFields>,

    readonly filters: FilterGroup<DocumentFilterFields> = new FilterGroup(),
  ) {}
}