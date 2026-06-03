// backend/src/modules/inquilino-documentos/application/use-cases/cambiar-estado.usecase.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import type { InquilinoDocumentosRepositoryPort } from '../ports/inquilino-documentos-repository.port';
import type { UpdateInquilinoDocumentoDto } from '../dto/update-inquilino-documento.dto';
import type { InquilinoDocumento } from '../../domain/entities/inquilino-documento.entity';

@Injectable()
export class CambiarEstadoInquilinoDocumentoUseCase {
  constructor(
    private readonly repo: InquilinoDocumentosRepositoryPort,
  ) {}

  async execute(
    documentoId: number,
    dto: UpdateInquilinoDocumentoDto,
  ): Promise<InquilinoDocumento> {
    const documento = await this.repo.findById(documentoId);

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    documento.estado = dto.estado;
    documento.comentarioRechazo = dto.comentarioRechazo ?? null;

    return this.repo.saveDocumento(documento);
  }
}
