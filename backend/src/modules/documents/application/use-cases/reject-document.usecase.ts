import { Inject, Injectable } from '@nestjs/common';

import {
  DOCUMENT_AUDIT_REPOSITORY,
  DOCUMENT_REPOSITORY,
} from '@/modules/documents/application/tokens/document.tokens';

import type { DocumentAuditRepositoryPort } from '@/modules/documents/domain/repositories/document-audit.repository.port';
import type { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentAuditEntity } from '@/modules/documents/domain/entities/document-audit.entity';
import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';

import { DocumentAuditAction } from '@/modules/documents/domain/enums/document-audit-action.enum';

import { DocumentNotFoundException } from '@/modules/documents/domain/exceptions/document-not-found.exception';
import { InvalidDocumentStatusException } from '@/modules/documents/domain/exceptions/invalid-document-status.exception';

@Injectable()
export class RejectDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentsRepository: DocumentRepositoryPort,

    @Inject(DOCUMENT_AUDIT_REPOSITORY)
    private readonly auditRepository: DocumentAuditRepositoryPort,
  ) {}

  async execute(params: {
    documentId: number;
    adminId: number;
    reason: string;
  }): Promise<DocumentEntity> {
    const document = await this.documentsRepository.findById(params.documentId);

    if (!document) {
      throw new DocumentNotFoundException(params.documentId);
    }

    const reason = params.reason?.trim();

    if (!reason) {
      throw new InvalidDocumentStatusException(
        'Rejected documents require a rejection reason.',
      );
    }

    document.reject(params.adminId, reason);

    const updated = await this.documentsRepository.save(document);

    await this.auditRepository.save(
      new DocumentAuditEntity(
        null,
        updated.id!,
        DocumentAuditAction.REJECTED,
        params.adminId,
        { reason },
      ),
    );

    return updated;
  }
}
