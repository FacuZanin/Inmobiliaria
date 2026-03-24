// backend\src\modules\operaciones\application\use-cases\list-operaciones.usecase.ts
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { OPERACION_REPOSITORY } from '../tokens';
import type { OperacionRepositoryPort } from '../ports/operacion-repository.port';
import { FilterOperacionesDto } from '../dto/filter-operaciones.dto';

@Injectable()
export class ListOperacionesUseCase {
  constructor(
    @Inject(OPERACION_REPOSITORY)
    private readonly repo: OperacionRepositoryPort,
  ) {}

  async execute(filters?: FilterOperacionesDto) {
    // El filtrado fino puede resolverse en el repo (infra)
    return this.repo.findAll(filters);
  }
}
