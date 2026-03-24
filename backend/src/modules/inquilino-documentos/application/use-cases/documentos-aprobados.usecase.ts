// backend/src/modules/inquilino-documentos/application/use-cases/documentos-aprobados.usecase.ts

import { Injectable } from '@nestjs/common';

import type { InquilinoDocumentosRepositoryPort } from '../ports/inquilino-documentos-repository.port';
import type { InquilinoDocumento } from '../../domain/entities/inquilino-documento.entity';

@Injectable()
export class DocumentosAprobadosUseCase {
  constructor(
    private readonly repo: InquilinoDocumentosRepositoryPort,
  ) {}

  async execute(inquilinoId: number): Promise<InquilinoDocumento[]> {
    return this.repo.findAprobadosByInquilino(inquilinoId);
  }
}
