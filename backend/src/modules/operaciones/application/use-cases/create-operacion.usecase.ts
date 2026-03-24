// backend\src\modules\operaciones\application\use-cases\create-operacion.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { OPERACION_REPOSITORY } from '../tokens';

import type { OperacionRepositoryPort } from '../ports/operacion-repository.port';
import { CreateOperacionDto } from '../dto/create-operacion.dto';
import { OperacionAggregate } from '../../domain/entities/operacion.aggregate';

@Injectable()
export class CreateOperacionUseCase {
  constructor(
    @Inject(OPERACION_REPOSITORY)
    private readonly repo: OperacionRepositoryPort,
  ) {}

  async execute(dto: CreateOperacionDto, userId: number) {
    const operacion = OperacionAggregate.create({
      tipo: dto.tipo,
      medio: dto.medio ?? null,
      propiedadId: dto.propiedadId,
      agenciaId: dto.agenciaId ?? null,
      propietarioDirectoId: dto.propietarioDirectoId ?? null,
      creadoPorId: userId,
      compradorInquilinoId: dto.compradorInquilinoId ?? null,

      observaciones: dto.observaciones ?? null,
    });

    return this.repo.save(operacion);
  }
}
