// backend\src\modules\inquilino-documentos\application\ports\inquilino-documentos-repository.port.ts

import { InquilinoDocumento } from '@shared/enums/tipo-documento-inquilino.enum';
import { TipoDocumentoInquilino } from '@shared/enums/tipo-documento-inquilino.enum';
import { DocumentoAudit } from '@shared/enums/documento-audit-action.enum';

import type { Inquilino } from '../../../inquilinos/domain/entities/inquilino.entity';

export interface InquilinoDocumentosRepositoryPort {
  findInquilinoByUserId(userId: number): Promise<Inquilino | null>;

  findDocumentoByInquilinoAndTipo(
    inquilinoId: number,
    tipo: TipoDocumentoInquilino,
  ): Promise<InquilinoDocumento | null>;

  findById(id: number): Promise<InquilinoDocumento | null>;

  saveDocumento(
    doc: Partial<InquilinoDocumento>,
  ): Promise<InquilinoDocumento>;

  listByInquilino(inquilinoId: number): Promise<InquilinoDocumento[]>;

  findAprobadosByInquilino(
    inquilinoId: number,
  ): Promise<InquilinoDocumento[]>;

  saveAudit(audit: Partial<DocumentoAudit>): Promise<DocumentoAudit>;
}
