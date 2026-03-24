// backend\src\modules\agencias\application\use-cases\obtener-agencia.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AGENCIAS_REPOSITORY } from '../tokens';
import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';
import type { Agencia } from '../../domain/entities/agencia.entity';

@Injectable()
export class ObtenerAgenciaUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly repo: AgenciasRepositoryPort,
  ) {}

  async execute(id: number): Promise<Agencia> {
    const a = await this.repo.findById(id);
    if (!a) {
      throw new NotFoundException('Agencia no encontrada');
    }
    return a;
  }
}
