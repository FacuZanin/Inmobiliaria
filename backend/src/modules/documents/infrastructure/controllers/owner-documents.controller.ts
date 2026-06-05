import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from '@/core/security/decorators/auth.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';

import { UploadDocumentDto } from '../../application/dto/upload-document.dto';

import { ListDocumentsByOwnerUseCase } from '../../application/use-cases/list-documents-by-owner.usecase';
import { UploadDocumentUseCase } from '../../application/use-cases/upload-document.usecase';

import { DocumentOwnerType } from '../../domain/enums/document-owner-type.enum';
import { DocumentDomainExceptionFilter } from '../filters/document-domain-exception.filter';

type AuthenticatedUser = {
  id: number;
};

@Controller('documents/owner')
@UseFilters(DocumentDomainExceptionFilter)
export class OwnerDocumentsController {
  constructor(
    private readonly uploadDocument: UploadDocumentUseCase,
    private readonly listDocuments: ListDocumentsByOwnerUseCase,
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
      ownerType: DocumentOwnerType.USER,
      dto,
      file,
    });
  }

  @Get()
  @Auth()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.listDocuments.execute({
      ownerId: user.id,
      ownerType: DocumentOwnerType.USER,
    });
  }
}
