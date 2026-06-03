// backend\src\modules\agencias\application\use-cases\update-agencia.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AGENCIAS_REPOSITORY } from '../tokens';
import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';
import type { UpdateAgenciaDto } from '../dto/update-agencia.dto';

@Injectable()
export class UpdateAgenciaUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly repo: AgenciasRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateAgenciaDto) {
    const found = await this.repo.findById(id);
    if (!found) {
      throw new NotFoundException('Agencia no encontrada');
    }
    return this.repo.update(id, dto);
  }
}
