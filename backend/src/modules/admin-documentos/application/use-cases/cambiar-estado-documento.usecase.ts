import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENTO_COMMAND_PORT } from '../ports/documento-command.port';
import { DOCUMENTO_AUDIT_REPOSITORY_PORT } from '../ports/documento-audit-repository.port';

import type { DocumentoCommandPort } from '../ports/documento-command.port';
import type { DocumentoAuditRepositoryPort } from '../ports/documento-audit-repository.port';

import { DocumentoEstado } from '@shared/enums/documento-estado.enum';
import { DocumentoAuditAction } from '@shared/enums/documento-audit-action.enum';
import { DocumentoTipo } from '@shared/enums/documento-tipo.enum';

import { DocumentoAuditService } from '../../domain/services/documento-audit.service';
import { DocumentoTipoVO } from '../../domain/value-objects/documento-tipo.vo';
import { DocumentoIdVO } from '../../domain/value-objects/documento-id.vo';

@Injectable()
export class CambiarEstadoDocumentoUseCase {
  private readonly auditService = new DocumentoAuditService();

  constructor(
    @Inject(DOCUMENTO_COMMAND_PORT)
    private readonly commandRepo: DocumentoCommandPort,

    @Inject(DOCUMENTO_AUDIT_REPOSITORY_PORT)
    private readonly auditRepo: DocumentoAuditRepositoryPort,
  ) {}

  async execute(params: {
    tipo: DocumentoTipo;
    documentoId: number;
    estado: DocumentoEstado;
    comentario?: string;
    userId: number;
  }) {
    const tipoVO = DocumentoTipoVO.from(params.tipo);
    const documentoIdVO = new DocumentoIdVO(params.documentoId);

    const documento = await this.commandRepo.cambiarEstado(
      tipoVO.value,
      documentoIdVO.value,
      params.estado,
      params.comentario,
    );

    // ✅ Auditoría correcta (evento + metadata)
    const audit = this.auditService.registrar({
      documentoId: documentoIdVO.value,
      documentoTipo: tipoVO.value,
      action: DocumentoAuditAction.ESTADO_CAMBIADO,
      metadata: {
        nuevoEstado: params.estado,
      },
      performedById: params.userId,
      comentario: params.comentario ?? null,
    });

    await this.auditRepo.save(audit);

    return documento;
  }
}