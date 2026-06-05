// backend\src\modules\documents\application\queries\handlers\get-documents-by-status.query-handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@/core/application/dto/pagination-query.dto';

import { DOCUMENT_QUERY_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import { DocumentQueryRepositoryPort } from '../ports/document-query.repository';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

@Injectable()
export class GetDocumentsByStatusQueryHandler {
  constructor(
    @Inject(DOCUMENT_QUERY_REPOSITORY)
    private readonly queryRepository: DocumentQueryRepositoryPort,
  ) {}

  async execute(
    status: DocumentStatus,
    pagination: PaginationQueryDto,
  ) {
    return this.queryRepository.findMany({
      status,
      page: pagination.page,
      limit: pagination.limit,
    });
  }
}