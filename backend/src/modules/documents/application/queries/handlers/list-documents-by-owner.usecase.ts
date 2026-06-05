// backend\src\modules\documents\application\queries\handlers\list-documents-by-owner.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@/core/application/dto/pagination-query.dto';

import { DOCUMENT_QUERY_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import {
  DocumentQueryRepositoryPort,
} from '../ports/document-query.repository';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

@Injectable()
export class ListDocumentsByOwnerQueryHandler {
  constructor(
    @Inject(DOCUMENT_QUERY_REPOSITORY)
    private readonly queryRepository: DocumentQueryRepositoryPort,
  ) {}

  async execute(
    params: {
      ownerId: number;
      ownerType: DocumentOwnerType;
      status?: DocumentStatus;
    },
    pagination: PaginationQueryDto,
  ) {
    return this.queryRepository.findMany({
      ownerId: params.ownerId,
      ownerType: params.ownerType,
      status: params.status,

      page: pagination.page,
      limit: pagination.limit,

      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
    });
  }
}