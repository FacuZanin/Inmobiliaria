// backend\src\modules\documents\domain\entities\document-audit.entity.ts
import { DocumentAuditAction } from '../enums/document-audit-action.enum';

export type DocumentAuditMetadata = Readonly<Record<string, unknown>>;

export class DocumentAuditEntity {
  constructor(
    public readonly id: number | null,

    public readonly documentId: number,

    public readonly action: DocumentAuditAction,

    public readonly performedBy: number,

    public readonly metadata: DocumentAuditMetadata | null,

    public readonly createdAt?: Date,
  ) {
    if (!Number.isInteger(documentId) || documentId <= 0) {
      throw new Error('Document audit requires a persisted document id.');
    }

    if (!Number.isInteger(performedBy) || performedBy <= 0) {
      throw new Error(
        'Document audit performer id must be a positive integer.',
      );
    }
  }
}
