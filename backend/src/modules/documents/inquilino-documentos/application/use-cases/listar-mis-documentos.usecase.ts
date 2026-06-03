// backend/src/modules/inquilino-documentos/application/use-cases/listar-mis-documentos.usecase.ts

import { Injectable } from '@nestjs/common';

import type { InquilinoDocumentosRepositoryPort } from '../ports/inquilino-documentos-repository.port';
import type { InquilinoDocumento } from '../../domain/entities/inquilino-documento.entity';

@Injectable()
export class ListarMisDocumentosUseCase {
  constructor(
    private readonly repo: InquilinoDocumentosRepositoryPort,
  ) {}

  async execute(userId: number): Promise<InquilinoDocumento[]> {
    const inquilino = await this.repo.findInquilinoByUserId(userId);

    if (!inquilino) {
      return [];
    }

    return this.repo.listByInquilino(inquilino.id);
  }
}
