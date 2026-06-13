// backend/src/modules/documents/application/queries/handlers/get-documents-by-status.handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENT_QUERY_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import {
  DocumentQueryRepositoryPort,
} from '../ports/document-query.repository';

import { GetDocumentsByStatusQuery } from '../queries/get-documents-by-status.query';
import { PaginationParams } from '@/core/application/pagination/pagination-params';
import { SortingParams } from '@/core/querying/sorting/sorting-params';
import { DocumentSortableFields } from '../contracts/document-query-fields';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

@Injectable()
export class GetDocumentsByStatusHandler {
  constructor(
    @Inject(DOCUMENT_QUERY_REPOSITORY)
    private readonly queryRepository: DocumentQueryRepositoryPort,
  ) {}

  async execute(
    queryOrStatus: GetDocumentsByStatusQuery | DocumentStatus,
    pagination?: PaginationParams & SortingParams<DocumentSortableFields>,
  ) {
    const query =
      queryOrStatus instanceof GetDocumentsByStatusQuery
        ? queryOrStatus
        : new GetDocumentsByStatusQuery(
            queryOrStatus,
            pagination ?? {},
            {
              field: pagination?.field ?? pagination?.sortBy ?? 'createdAt',
              direction: pagination?.direction ?? pagination?.sortOrder ?? 'DESC',
            },
          );

    return this.queryRepository.findMany({
      status: query.status,

      pagination: query.pagination,

      sorting: query.sorting,

      filters: query.filters,
    });
  }
}
