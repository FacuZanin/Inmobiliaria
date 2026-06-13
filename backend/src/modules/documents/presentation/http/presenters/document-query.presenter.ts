// backend\src\modules\documents\presentation\http\presenters\document-query.presenter.ts
import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/application/pagination/pagination-params';
import { SortingParams } from '@/core/querying/sorting/sorting-params';

import { GetDocumentsByStatusQuery } from '@/modules/documents/application/queries/queries/get-documents-by-status.query';
import { ListDocumentsByOwnerQuery } from '@/modules/documents/application/queries/queries/list-documents-by-owner.query';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentSortableFields } from '@/modules/documents/application/queries/contracts/document-query-fields';

type DocumentPaginationQuery = PaginationParams &
  SortingParams<DocumentSortableFields>;

@Injectable()
export class DocumentQueryPresenter {
  toGetDocumentsByStatusQuery(
    status: DocumentStatus,
    pagination: DocumentPaginationQuery,
  ): GetDocumentsByStatusQuery {
    return new GetDocumentsByStatusQuery(
      status,
      pagination,
      {
        field: pagination.field ?? pagination.sortBy ?? 'createdAt',
        direction: pagination.direction ?? pagination.sortOrder ?? 'DESC',
      },
    );
  }

  toListDocumentsByOwnerQuery(
    params: {
      ownerId: number;
      ownerType: DocumentOwnerType;
      status?: DocumentStatus;
    },
    pagination: DocumentPaginationQuery,
  ): ListDocumentsByOwnerQuery {
    return new ListDocumentsByOwnerQuery(
      params.ownerId,
      params.ownerType,
      params.status,
      pagination,
      {
        field: pagination.field ?? pagination.sortBy ?? 'createdAt',
        direction: pagination.direction ?? pagination.sortOrder ?? 'DESC',
      },
    );
  }
}
