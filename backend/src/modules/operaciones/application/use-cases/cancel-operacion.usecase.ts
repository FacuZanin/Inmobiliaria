// backend\src\modules\operaciones\application\use-cases\cancel-operacion.usecase.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { OPERACION_REPOSITORY } from '../tokens';
import type { OperacionRepositoryPort } from '../ports/operacion-repository.port';

@Injectable()
export class CancelarOperacionUseCase {
  constructor(
    @Inject(OPERACION_REPOSITORY)
    private readonly repo: OperacionRepositoryPort,
  ) {}

  async execute(id: number) {
    const operacion = await this.repo.findById(id);
    if (!operacion) {
      throw new NotFoundException('Operación no encontrada');
    }

    operacion.cancelar();
    return this.repo.update(operacion);
  }
}
