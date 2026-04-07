// backend\src\modules\inquilino-documentos\application\ports\inquilino-documentos-repository.port.ts

import { InquilinoDocumento } from '../../domain/entities/inquilino-documento.entity';
import { DocumentoAuditAction } from '@shared/contracts/enums/documento-audit-action.enum';
import { DocumentoAudit } from '../../../admin-documentos/domain/entities/documento-audit.entity';

import type { Inquilino } from '../../../inquilinos/domain/entities/inquilino.entity';
import { TipoDocumentoInquilino } from '@shared/contracts/enums/tipo-documento-inquilino.enum';

export interface InquilinoDocumentosRepositoryPort {
  findInquilinoByUserId(userId: number): Promise<Inquilino | null>;

  findDocumentoByInquilinoAndTipo(
    inquilinoId: number,
    tipo: TipoDocumentoInquilino,
  ): Promise<InquilinoDocumento | null>;

  findById(id: number): Promise<InquilinoDocumento | null>;

  saveDocumento(doc: Partial<InquilinoDocumento>): Promise<InquilinoDocumento>;

  listByInquilino(inquilinoId: number): Promise<InquilinoDocumento[]>;

  findAprobadosByInquilino(inquilinoId: number): Promise<InquilinoDocumento[]>;

  saveAudit(audit: Partial<DocumentoAudit>): Promise<DocumentoAudit>;
}
