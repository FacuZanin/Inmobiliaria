//backend\src\modules\agencias\application\use-cases\listar-agencias.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { AGENCIAS_REPOSITORY } from '../tokens';

import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';

@Injectable()
export class ListarAgenciasUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly agenciasRepository: AgenciasRepositoryPort,
  ) {}

  execute(filters?: {
    nombre?: string;
    localidad?: string;
    activa?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.agenciasRepository.findWithFilters(filters);
  }
}