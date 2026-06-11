//backend\src\modules\documents\application\queries\contracts\find-documents.query-params.ts 
import { FilterGroup } from '@/core/querying/filtering/nodes/filter-group';

import { PaginationParams } from '@/core/querying/pagination/pagination-params';

import { SortingParams } from '@/core/querying/sorting/sorting-params';

import {
  DocumentFilterFields,
  DocumentSortableFields,
} from './document-query-fields';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

export interface FindDocumentsQueryParams {
  status?: DocumentStatus;

  ownerId?: number;

  ownerType?: DocumentOwnerType;

  pagination: PaginationParams;

  sorting: SortingParams<DocumentSortableFields>;

  filters?: FilterGroup<DocumentFilterFields>;
}