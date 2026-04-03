// backend\src\modules\admin-documentos\domain\services\documento-audit.service.ts
import { DocumentoAuditAction } from '@shared/enums/documento-audit-action.enum';
import { DocumentoTipo } from '@shared/enums/documento-tipo.enum'

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