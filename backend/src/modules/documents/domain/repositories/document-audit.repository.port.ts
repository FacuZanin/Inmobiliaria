// backend\src\modules\documents\domain\repositories\document-audit.repository.port.ts
import { DocumentAuditEntity } from '../entities/document-audit.entity';

export interface DocumentAuditRepositoryPort {
  save(audit: DocumentAuditEntity): Promise<DocumentAuditEntity>;

  findByDocumentId(documentId: number): Promise<DocumentAuditEntity[]>;
}
