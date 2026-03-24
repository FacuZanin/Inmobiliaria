// backend\src\modules\operaciones\application\use-cases\find-operacion-by-id.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { OPERACION_REPOSITORY } from '../tokens';

import type { OperacionRepositoryPort } from '../ports/operacion-repository.port';
import { OperacionAggregate } from '../../domain/entities/operacion.aggregate';

@Injectable()
export class FindOperacionByIdUseCase {
  constructor(
    @Inject(OPERACION_REPOSITORY)
    private readonly repo: OperacionRepositoryPort,
  ) {}

  async execute(id: number): Promise<OperacionAggregate> {
    const operacion = await this.repo.findById(id);

    if (!operacion) {
      throw new NotFoundException('Operación no encontrada');
    }

    return operacion;
  }
}
