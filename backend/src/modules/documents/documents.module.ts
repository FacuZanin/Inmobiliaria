// backend\src\modules\documents\documents.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentOrmEntity } from './infrastructure/persistence/typeorm/entities/document.orm-entity';
import { DocumentAuditOrmEntity } from './infrastructure/persistence/typeorm/entities/document-audit.orm-entity';

import { DocumentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document.typeorm.repository';
import { DocumentAuditTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document-audit.typeorm.repository';

import {
  DOCUMENT_REPOSITORY,
  DOCUMENT_AUDIT_REPOSITORY,
} from './application/tokens/document.tokens';

import { FILE_STORAGE } from './application/tokens/storage.tokens';

import { LocalFileStorageService } from './infrastructure/storage/local/local-file-storage.service';

import { UploadDocumentUseCase } from './application/use-cases/upload-document.usecase';
import { ChangeDocumentStatusUseCase } from './application/use-cases/change-document-status.usecase';
import { GetDocumentsByStatusUseCase } from './application/use-cases/get-documents-by-status.usecase';

import { ListDocumentsByOwnerUseCase } from './application/use-cases/list-documents-by-owner.usecase';

import { TenantDocumentsController } from './infrastructure/controllers/tenant-documents.controller';
import { OwnerDocumentsController } from './infrastructure/controllers/owner-documents.controller';
import { AdminDocumentsController } from './infrastructure/controllers/admin-documents.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentOrmEntity, DocumentAuditOrmEntity]),
  ],

  controllers: [
    TenantDocumentsController,
    OwnerDocumentsController,
    AdminDocumentsController,
  ],

  providers: [
    UploadDocumentUseCase,
    ChangeDocumentStatusUseCase,
    GetDocumentsByStatusUseCase,
    ListDocumentsByOwnerUseCase,

    {
      provide: DOCUMENT_REPOSITORY,
      useClass: DocumentTypeOrmRepository,
    },

    {
      provide: DOCUMENT_AUDIT_REPOSITORY,
      useClass: DocumentAuditTypeOrmRepository,
    },

    {
      provide: FILE_STORAGE,
      useClass: LocalFileStorageService,
    },
  ],

  exports: [DOCUMENT_REPOSITORY, DOCUMENT_AUDIT_REPOSITORY],
})
export class DocumentsModule {}
