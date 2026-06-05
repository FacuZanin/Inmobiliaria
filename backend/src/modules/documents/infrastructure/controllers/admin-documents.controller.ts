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

import { ChangeDocumentStatusUseCase } from '../../application/use-cases/change-document-status.usecase';
import { GetDocumentsByStatusUseCase } from '../../application/use-cases/get-documents-by-status.usecase';
import { ListDocumentsByOwnerUseCase } from '../../application/use-cases/list-documents-by-owner.usecase';

import { DocumentOwnerType } from '../../domain/enums/document-owner-type.enum';
import { DocumentStatus } from '../../domain/enums/document-status.enum';
import { DocumentDomainExceptionFilter } from '../filters/document-domain-exception.filter';

@Controller('admin/documents')
@UseFilters(DocumentDomainExceptionFilter)
export class AdminDocumentsController {
  constructor(
    private readonly changeDocumentStatus: ChangeDocumentStatusUseCase,
    private readonly getDocumentsByStatus: GetDocumentsByStatusUseCase,
    private readonly listDocuments: ListDocumentsByOwnerUseCase,
  ) {}

  @Get()
  @Auth()
  listByStatus(@Query('status') status?: DocumentStatus) {
    if (status) {
      return this.getDocumentsByStatus.execute(status);
    }

    return this.getDocumentsByStatus.execute(DocumentStatus.PENDING);
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
