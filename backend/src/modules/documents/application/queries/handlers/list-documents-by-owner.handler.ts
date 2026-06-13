// backend\src\modules\documents\application\queries\handlers\list-documents-by-owner.handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/application/pagination/pagination-params';
import { SortingParams } from '@/core/querying/sorting/sorting-params';

import { DOCUMENT_QUERY_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import { DocumentQueryRepositoryPort } from '../ports/document-query.repository';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentSortableFields } from '../contracts/document-query-fields';

@Injectable()
export class ListDocumentsByOwnerHandler {
  constructor(
    @Inject(DOCUMENT_QUERY_REPOSITORY)
    private readonly queryRepository: DocumentQueryRepositoryPort,
  ) {}

  async execute(
    query: {
      ownerId: number;
      ownerType: DocumentOwnerType;
      status?: DocumentStatus;
    },
    pagination: PaginationParams & SortingParams<DocumentSortableFields>,
  ) {
    return this.queryRepository.findMany({
      ownerId: query.ownerId,
      ownerType: query.ownerType,
      status: query.status,
      pagination,
      sorting: {
        field: pagination.field ?? pagination.sortBy ?? 'createdAt',
        direction: pagination.direction ?? pagination.sortOrder ?? 'DESC',
      },
    });
  }
}
