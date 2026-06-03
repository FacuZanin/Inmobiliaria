// backend\src\modules\admin-documentos\application\ports\documento-audit-repository.port.ts
import { DocumentoAudit } from '../../domain/entities/documento-audit.entity';

export const DOCUMENTO_AUDIT_REPOSITORY_PORT =
  'DOCUMENTO_AUDIT_REPOSITORY_PORT';

export interface DocumentoAuditRepositoryPort {
  save(audit: Partial<DocumentoAudit>): Promise<void>;

  findByDocumento(
    documentoId: number,
    tipo: 'INQUILINO' | 'PROPIETARIO',
  ): Promise<DocumentoAudit[]>;
}
