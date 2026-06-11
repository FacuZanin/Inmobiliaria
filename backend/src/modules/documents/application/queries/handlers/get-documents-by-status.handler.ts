// backend\src\modules\documents\application\queries\handlers\get-documents-by-status.handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENT_QUERY_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import {
  DocumentQueryRepositoryPort,
} from '../ports/document-query.repository';

import { GetDocumentsByStatusQuery } from '../queries/get-documents-by-status.query';

@Injectable()
export class GetDocumentsByStatusHandler {
  constructor(
    @Inject(DOCUMENT_QUERY_REPOSITORY)
    private readonly queryRepository: DocumentQueryRepositoryPort,
  ) {}

  async execute(
    query: GetDocumentsByStatusQuery,
  ) {
    return this.queryRepository.findMany({
      status: query.status,

      pagination: query.pagination,

      sorting: query.sorting,

      filters: query.filters,
    });
  }
}