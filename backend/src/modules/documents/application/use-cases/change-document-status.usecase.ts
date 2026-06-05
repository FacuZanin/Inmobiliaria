import { Inject, Injectable } from '@nestjs/common';

import {
  DOCUMENT_AUDIT_REPOSITORY,
  DOCUMENT_REPOSITORY,
} from '../tokens/document.tokens';

import type { DocumentAuditRepositoryPort } from '../../domain/repositories/document-audit.repository.port';
import type { DocumentRepositoryPort } from '../../domain/repositories/document.repository.port';

import { DocumentAuditEntity } from '../../domain/entities/document-audit.entity';
import { DocumentEntity } from '../../domain/entities/document.entity';

import { DocumentAuditAction } from '../../domain/enums/document-audit-action.enum';
import { DocumentStatus } from '../../domain/enums/document-status.enum';

import { DocumentNotFoundException } from '../../domain/exceptions/document-not-found.exception';
import { InvalidDocumentStatusException } from '../../domain/exceptions/invalid-document-status.exception';

@Injectable()
export class ChangeDocumentStatusUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documents: DocumentRepositoryPort,

    @Inject(DOCUMENT_AUDIT_REPOSITORY)
    private readonly audits: DocumentAuditRepositoryPort,
  ) {}

  async execute(params: {
    documentId: number;
    status: DocumentStatus;
    adminId: number;
    rejectionReason?: string;
  }): Promise<DocumentEntity> {
    const document = await this.documents.findById(params.documentId);

    if (!document) {
      throw new DocumentNotFoundException(params.documentId);
    }

    const rejectionReason = params.rejectionReason?.trim();

    switch (params.status) {
      case DocumentStatus.APPROVED:
        document.approve(params.adminId);
        break;

      case DocumentStatus.REJECTED:
        if (!rejectionReason) {
          throw new InvalidDocumentStatusException(
            'Rejected documents require a rejection reason.',
          );
        }

        document.reject(params.adminId, rejectionReason);
        break;

      case DocumentStatus.UNDER_REVIEW:
        document.markUnderReview();
        break;

      default:
        throw new InvalidDocumentStatusException(
          `Unsupported document status transition: ${params.status}`,
        );
    }

    const saved = await this.documents.save(document);

    await this.audits.save(
      new DocumentAuditEntity(
        null,
        saved.id!,
        this.resolveAuditAction(params.status),
        params.adminId,
        {
          rejectionReason: rejectionReason ?? null,
        },
      ),
    );

    return saved;
  }

  private resolveAuditAction(status: DocumentStatus): DocumentAuditAction {
    const actions: Partial<Record<DocumentStatus, DocumentAuditAction>> = {
      [DocumentStatus.APPROVED]: DocumentAuditAction.APPROVED,
      [DocumentStatus.REJECTED]: DocumentAuditAction.REJECTED,
      [DocumentStatus.UNDER_REVIEW]: DocumentAuditAction.UNDER_REVIEW,
    };

    const action = actions[status];

    if (!action) {
      throw new InvalidDocumentStatusException(
        `Unsupported document audit action: ${status}`,
      );
    }

    return action;
  }
}
