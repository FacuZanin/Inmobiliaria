import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseFilters,
} from '@nestjs/common';

import { Auth } from '@/core/security/decorators/auth.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';

import { UpdateDocumentStatusDto } from '@modules/documents/application/dto/update-document-status.dto';
import { PaginationQueryDto } from '@/core/application/dto/pagination-query.dto';

import { ChangeDocumentStatusUseCase } from '../../application/commands/use-cases/change-document-status.usecase';
import { GetDocumentsByStatusQueryHandler } from '../../application/queries/handlers/get-documents-by-status.query-handler';
import { ListDocumentsByOwnerQueryHandler } from '../../application/queries/handlers/list-documents-by-owner.usecase';

import { DocumentOwnerType } from '../../domain/enums/document-owner-type.enum';
import { DocumentStatus } from '../../domain/enums/document-status.enum';
import { DocumentDomainExceptionFilter } from '../filters/document-domain-exception.filter';

@Controller('admin/documents')
@UseFilters(DocumentDomainExceptionFilter)
export class AdminDocumentsController {
  constructor(
    private readonly changeDocumentStatus: ChangeDocumentStatusUseCase,
    private readonly getDocumentsByStatus: GetDocumentsByStatusQueryHandler,
    private readonly listDocuments: ListDocumentsByOwnerQueryHandler,
  ) {}

@Get()
@Auth()
async listByStatus(
  @Query('status') status: DocumentStatus = DocumentStatus.PENDING,
  @Query() pagination: PaginationQueryDto,
) {
  return this.getDocumentsByStatus.execute(
    status,
    pagination,
  );
}

  @Get(':ownerType/:ownerId')
  @Auth()
  listByOwner(
    @Param('ownerId') ownerId: string,
    @Param('ownerType') ownerType: DocumentOwnerType,
  ) {
    return this.listDocuments.execute({
      ownerId: Number(ownerId),
      ownerType,
    });
  }

  @Patch(':documentId/status')
  @Auth()
  updateStatus(
    @Param('documentId') documentId: string,
    @Body() dto: UpdateDocumentStatusDto,
    @CurrentUser('id') adminId: number,
  ) {
    return this.changeDocumentStatus.execute({
      documentId: Number(documentId),
      status: dto.status,
      rejectionReason: dto.rejectionReason,
      adminId,
    });
  }
}
