// backend\src\modules\agencias\application\use-cases\create-agencia.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { AGENCIAS_REPOSITORY } from '../tokens';
import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';
import type { CreateAgenciaDto } from '../dto/create-agencia.dto';

@Injectable()
export class CreateAgenciaUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly repo: AgenciasRepositoryPort,
  ) {}

  execute(dto: CreateAgenciaDto) {
    return this.repo.create(dto);
  }
}
