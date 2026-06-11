// backend\src\modules\documents\presentation\http\presenters\document-query.presenter.ts
import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@/core/application/dto/pagination-query.dto';

import { GetDocumentsByStatusQuery } from '@/modules/documents/application/queries/queries/get-documents-by-status.query';
import { ListDocumentsByOwnerQuery } from '@/modules/documents/application/queries/queries/list-documents-by-owner.query';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

@Injectable()
export class DocumentQueryPresenter {
  toGetDocumentsByStatusQuery(
    status: DocumentStatus,
    pagination: PaginationQueryDto,
  ): GetDocumentsByStatusQuery {
    return new GetDocumentsByStatusQuery(
      status,
      pagination.page,
      pagination.limit,
      pagination.sortBy,
      pagination.sortOrder,
    );
  }

  toListDocumentsByOwnerQuery(
    params: {
      ownerId: number;
      ownerType: DocumentOwnerType;
      status?: DocumentStatus;
    },
    pagination: PaginationQueryDto,
  ): ListDocumentsByOwnerQuery {
    return new ListDocumentsByOwnerQuery(
      params.ownerId,
      params.ownerType,
      params.status,
      pagination.page,
      pagination.limit,
      pagination.sortBy,
      pagination.sortOrder,
    );
  }
}