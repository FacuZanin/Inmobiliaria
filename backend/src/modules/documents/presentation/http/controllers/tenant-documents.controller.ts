// backend\src\modules\documents\presentation\http\controllers\tenant-documents.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from '@/security/decorators/auth.decorator';

import { CurrentUser } from '@/security/decorators/current-user.decorator';

import { PaginationParams } from '@/core/querying/pagination/pagination-params';

import { UploadDocumentRequest } from '@/modules/documents/presentation/http/requests/upload-document.request';

import { UploadDocumentRequestMapper } from '@/modules/documents/presentation/http/mappers/upload-document-request.mapper';

import { UploadDocumentHandler } from '@/modules/documents/application/commands/handlers/upload-document.handler';

import { ListDocumentsByOwnerQuery } from '@/modules/documents/application/queries/queries/list-documents-by-owner.query';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

import { DocumentDomainExceptionFilter } from '@/modules/documents/presentation/http/filters/document-domain-exception.filter';

type AuthenticatedUser = {
  id: number;
};

@Controller('documents/tenant')
@UseFilters(DocumentDomainExceptionFilter)
export class TenantDocumentsController {
  constructor(
    private readonly uploadDocumentHandler: UploadDocumentHandler,

    private readonly listMyDocuments: ListDocumentsByOwnerQuery,
  ) {}

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body()
    request: UploadDocumentRequest,

    @UploadedFile()
    file: Express.Multer.File,

    @CurrentUser()
    user: AuthenticatedUser,
  ) {
    const command = UploadDocumentRequestMapper.toCommand({
      ownerId: user.id,

      ownerType: DocumentOwnerType.TENANT,

      dto: request,

      file,
    });

    return this.uploadDocumentHandler.execute(command);
  }

  @Get()
  @Auth()
  list(
    @CurrentUser()
    user: AuthenticatedUser,

    @Query()
    pagination: PaginationParams,
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
