// backend\src\modules\documents\application\queries\handlers\list-documents-by-owner.handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/querying/pagination/pagination-params';
import { SortingParams } from '@/core/querying/sorting/sorting-params';

import { DOCUMENT_QUERY_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import {
  DocumentQueryRepositoryPort,
} from '../ports/document-query.repository';

import { ListDocumentsByOwnerQuery } from '../queries/list-documents-by-owner.query';

import { DocumentSortableFields } from '../contracts/document-sortable-fields.type';

@Injectable()
export class ListDocumentsByOwnerHandler {
  constructor(
    @Inject(DOCUMENT_QUERY_REPOSITORY)
    private readonly queryRepository: DocumentQueryRepositoryPort,
  ) {}

  async execute(
    query: ListDocumentsByOwnerQuery,
    pagination: PaginationParams &
      SortingParams<DocumentSortableFields>,
  ) {
    return this.queryRepository.findMany({
      ownerId: query.ownerId,
      ownerType: query.ownerType,

      status: query.status,

      page: pagination.page,
      limit: pagination.limit,

      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
    });
  }
}