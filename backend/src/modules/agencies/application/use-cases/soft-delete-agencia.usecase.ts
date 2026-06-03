// backend\src\modules\agencias\application\use-cases\soft-delete-agencia.usecase.ts
import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { AGENCIAS_REPOSITORY } from '../tokens';

import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';

@Injectable()
export class SoftDeleteAgenciaUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly repo: AgenciasRepositoryPort,
  ) {}

  execute(id: number) {
    return this.repo.softDelete(id);
  }
}