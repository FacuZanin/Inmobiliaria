// backend\src\modules\documents\presentation\http\controllers\admin-documents.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseFilters,
} from '@nestjs/common';

import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';

import { PaginationParams } from '@/core/application/pagination/pagination-params';

import { UpdateDocumentStatusRequest } from '@/modules/documents/presentation/http/requests/update-document-status.request';

import { ChangeDocumentStatusHandler } from '@/modules/documents/application/commands/handlers/change-document-status.handler';

import { GetDocumentsByStatusHandler } from '@/modules/documents/application/queries/handlers/get-documents-by-status.handler';
import { ListDocumentsByOwnerHandler } from '@/modules/documents/application/queries/handlers/list-documents-by-owner.handler';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

import { DocumentDomainExceptionFilter } from '@/modules/documents/presentation/http/filters/document-domain-exception.filter';

@Controller('admin/documents')
@UseFilters(DocumentDomainExceptionFilter)
export class AdminDocumentsController {
  constructor(
    private readonly changeDocumentStatusHandler: ChangeDocumentStatusHandler,

    private readonly getDocumentsByStatus: GetDocumentsByStatusHandler,

    private readonly listDocuments: ListDocumentsByOwnerHandler,
  ) {}

  @Get()
  @Auth()
  async listByStatus(
    @Query('status')
    status: DocumentStatus = DocumentStatus.PENDING,

    @Query()
    pagination: PaginationParams,
  ) {
    return this.getDocumentsByStatus.execute(status, pagination);
  }

  @Get(':ownerType/:ownerId')
  @Auth()
  listByOwner(
    @Param('ownerId')
    ownerId: string,

    @Param('ownerType')
    ownerType: DocumentOwnerType,

    @Query()
    pagination: PaginationParams,
  ) {
    return this.listDocuments.execute(
      {
        ownerId: Number(ownerId),
        ownerType,
      },
      pagination,
    );
  }

  @Patch(':documentId/status')
  @Auth()
  updateStatus(
    @Param('documentId')
    documentId: string,

    @Body()
    request: UpdateDocumentStatusRequest,

    @CurrentUser('id')
    adminId: number,
  ) {
    return this.changeDocumentStatusHandler.execute({
      documentId: Number(documentId),

      status: request.status,

      rejectionReason: request.rejectionReason,

      adminId,
    });
  }
}
