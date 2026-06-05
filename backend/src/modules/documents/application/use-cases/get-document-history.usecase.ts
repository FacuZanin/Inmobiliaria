// backend\src\modules\documents\application\use-cases\get-document-history.usecase.ts

import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENT_AUDIT_REPOSITORY } from '../tokens/document.tokens';

import type { DocumentAuditRepositoryPort } from '../../domain/repositories/document-audit.repository.port';

@Injectable()
export class GetDocumentHistoryUseCase {
  constructor(
    @Inject(DOCUMENT_AUDIT_REPOSITORY)
    private readonly audits: DocumentAuditRepositoryPort,
  ) {}

  async execute(documentId: number) {
    return this.audits.findByDocumentId(documentId);
  }
}
