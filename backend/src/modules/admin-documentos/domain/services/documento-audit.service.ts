// backend\src\modules\admin-documentos\domain\services\documento-audit.service.ts
import { DocumentoAuditAction } from '../entities/documento-audit.entity';
import { DocumentoTipo } from '../entities/documento-audit.entity';

export interface RegistrarAuditParams {
  documentoId: number;
  documentoTipo: DocumentoTipo;
  action: DocumentoAuditAction;
  performedById: number;
  comentario?: string | null;
}

export class DocumentoAuditService {
  registrar(params: RegistrarAuditParams) {
    return {
      documentoId: params.documentoId,
      documentoTipo: params.documentoTipo,
      action: params.action,
      performedById: params.performedById,
      comentario: params.comentario ?? null,
    };
  }
}
