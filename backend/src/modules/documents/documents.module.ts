// backend\src\modules\documents\documents.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentOrmEntity } from './infrastructure/persistence/typeorm/entities/document.orm-entity';
import { DocumentAuditOrmEntity } from './infrastructure/persistence/typeorm/entities/document-audit.orm-entity';

import { DocumentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document.typeorm.repository';
import { DocumentAuditTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document-audit.typeorm.repository';
import { DocumentQueryTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/document-query.typeorm.repository';
import { DocumentsTypeOrmUnitOfWork } from './infrastructure/persistence/typeorm/repositories/transaction/documents-typeorm.unit-of-work';
import { TransactionalRepositoryFactory } from './infrastructure/persistence/typeorm/repositories/transaction/transactional-repository.factory';

import {
  DOCUMENT_REPOSITORY,
  DOCUMENT_AUDIT_REPOSITORY,
  DOCUMENT_QUERY_REPOSITORY,
} from './application/tokens/document.tokens';

import { FILE_STORAGE } from './application/tokens/storage.tokens';
import { DOCUMENTS_UNIT_OF_WORK } from './application/tokens/document.tokens';

import { LocalFileStorageService } from './infrastructure/storage/local/local-file-storage.service';

import { UploadDocumentHandler } from './application/commands/handlers/upload-document.handler';
import { ChangeDocumentStatusHandler } from './application/commands/handlers/change-document-status.handler';
import { GetDocumentsByStatusHandler } from './application/queries/handlers/get-documents-by-status.handler';

import { ListDocumentsByOwnerHandler } from './application/queries/handlers/list-documents-by-owner.handler';

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
    UploadDocumentHandler,
    ChangeDocumentStatusHandler,
    GetDocumentsByStatusHandler,
    ListDocumentsByOwnerHandler,
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
      provide: DOCUMENT_QUERY_REPOSITORY,
      useClass: DocumentQueryTypeOrmRepository,
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
