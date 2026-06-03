// backend\src\modules\agencias\application\use-cases\suspender-agencia.usecase.ts
import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { AGENCIAS_REPOSITORY } from '../tokens';

import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';

@Injectable()
export class SuspenderAgenciaUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly repo: AgenciasRepositoryPort,
  ) {}

  execute(id: number, motivo: string) {
    return this.repo.suspender(id, motivo);
  }
}