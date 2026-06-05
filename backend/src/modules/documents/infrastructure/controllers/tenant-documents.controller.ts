import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from '@/core/security/decorators/auth.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';

import { UploadDocumentDto } from '../../application/dto/upload-document.dto';
import { PaginationQueryDto } from '@/core/application/dto/pagination-query.dto';

import { ListDocumentsByOwnerQueryHandler } from '@modules/documents/application/queries/handlers/list-documents-by-owner.usecase';
import { UploadDocumentUseCase } from '../../application/commands/use-cases/upload-document.usecase';

import { DocumentOwnerType } from '../../domain/enums/document-owner-type.enum';
import { DocumentDomainExceptionFilter } from '../filters/document-domain-exception.filter';

type AuthenticatedUser = {
  id: number;
};

@Controller('documents/tenant')
@UseFilters(DocumentDomainExceptionFilter)
export class TenantDocumentsController {
  constructor(
    private readonly uploadDocument: UploadDocumentUseCase,
    private readonly listMyDocuments: ListDocumentsByOwnerQueryHandler,
  ) {}

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.uploadDocument.execute({
      ownerId: user.id,
      ownerType: DocumentOwnerType.TENANT,
      dto,
      file,
    });
  }

  @Get()
  @Auth()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.listMyDocuments.execute(
      {
        ownerId: user.id,
        ownerType: DocumentOwnerType.TENANT,
      },
      pagination,
    );
  }
}
