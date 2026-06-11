// backend\src\modules\documents\documents.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentOrmEntity } from './infrastructure/persistence/typeorm/entities/document.orm-entity';
import { DocumentAuditOrmEntity } from './infrastructure/persistence/typeorm/entities/document-audit.orm-entity';

import { DocumentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document.typeorm.repository';
import { DocumentAuditTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document-audit.typeorm.repository';
import { DocumentsTypeOrmUnitOfWork } from './infrastructure/persistence/typeorm/repositories/transaction/documents-typeorm.unit-of-work';
import { TransactionalRepositoryFactory } from './infrastructure/persistence/typeorm/repositories/transaction/transactional-repository.factory';

import {
  DOCUMENT_REPOSITORY,
  DOCUMENT_AUDIT_REPOSITORY,
} from './application/tokens/document.tokens';

import { FILE_STORAGE } from './application/tokens/storage.tokens';
import { DOCUMENTS_UNIT_OF_WORK } from './application/tokens/document.tokens';

import { LocalFileStorageService } from './infrastructure/storage/local/local-file-storage.service';

import { UploadDocumentUseCase } from './application/commands/use-cases/upload-document.usecase';
import { ChangeDocumentStatusUseCase } from './application/commands/use-cases/change-document-status.usecase';
import { GetDocumentsByStatusQueryHandler } from './application/queries/use-cases/get-documents-by-status.usecase';

import { ListDocumentsByOwnerQueryHandler } from './application/queries/use-cases/list-documents-by-owner.usecase';

import { TenantDocumentsController } from './presentation/http/controllers/tenant-documents.controller';
import { OwnerDocumentsController } from './presentation/http/controllers/owner-documents.controller';
import { AdminDocumentsController } from './presentation/http/controllers/admin-documents.controller';

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
    GetDocumentsByStatusQueryHandler,
    ListDocumentsByOwnerQueryHandler,
    TransactionalRepositoryFactory,

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

    {
      provide: DOCUMENTS_UNIT_OF_WORK,
      useClass: DocumentsTypeOrmUnitOfWork,
    },
  ],

  exports: [DOCUMENT_REPOSITORY, DOCUMENT_AUDIT_REPOSITORY],
})
export class DocumentsModule {}
