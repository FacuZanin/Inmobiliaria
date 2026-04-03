// backend\src\modules\admin-documentos\application\use-cases\ver-historial-documento.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENTO_AUDIT_REPOSITORY_PORT } from '../ports/documento-audit-repository.port';

import type { DocumentoAuditRepositoryPort } from '../ports/documento-audit-repository.port';

import { DocumentoTipo } from '@shared/enums/documento-tipo.enum';
import { DocumentoTipoVO } from '../../domain/value-objects/documento-tipo.vo';
import { DocumentoIdVO } from '../../domain/value-objects/documento-id.vo';

@Injectable()
export class VerHistorialDocumentoUseCase {
  constructor(
    @Inject(DOCUMENTO_AUDIT_REPOSITORY_PORT)
    private readonly auditRepo: DocumentoAuditRepositoryPort,
  ) {}

  execute(documentoId: number, tipo: DocumentoTipo) {
    const idVO = new DocumentoIdVO(documentoId);
    const tipoVO = DocumentoTipoVO.from(tipo);

    return this.auditRepo.findByDocumento(idVO.value, tipoVO.value);
  }
}