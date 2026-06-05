import { Inject, Injectable } from '@nestjs/common';

import {
  DOCUMENT_AUDIT_REPOSITORY,
  DOCUMENT_REPOSITORY,
} from '@/modules/documents/application/tokens/document.tokens';

import { DOCUMENTS_UNIT_OF_WORK } from '@/modules/documents/application/tokens/document.tokens';

import type { DocumentsUnitOfWorkPort } from '@/modules/documents/application/ports/unit-of-work.port';

import type { DocumentAuditRepositoryPort } from '@/modules/documents/domain/repositories/document-audit.repository.port';
import type { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentAuditEntity } from '@/modules/documents/domain/entities/document-audit.entity';
import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';

import { DocumentAuditAction } from '@/modules/documents/domain/enums/document-audit-action.enum';

import { DocumentNotFoundException } from '@/modules/documents/domain/exceptions/document-not-found.exception';

@Injectable()
export class ApproveDocumentUseCase {
  constructor(
    @Inject(DOCUMENTS_UNIT_OF_WORK)
    private readonly uow: DocumentsUnitOfWorkPort,
  ) {}

  async execute(documentId: number, adminId: number): Promise<DocumentEntity> {
    return this.uow.execute(async ({ documents, audits }) => {
      const document = await documents.findById(documentId);

      if (!document) {
        throw new DocumentNotFoundException(documentId);
      }

      document.approve(adminId);

      const updated = await documents.save(document);

      await audits.save(
        new DocumentAuditEntity(
          null,
          updated.id!,
          DocumentAuditAction.APPROVED,
          adminId,
          null,
        ),
      );

      return updated;
    });
  }
}
