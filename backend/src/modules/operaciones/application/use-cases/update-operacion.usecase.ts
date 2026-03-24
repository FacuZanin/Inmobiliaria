// backend\src\modules\operaciones\application\use-cases\update-operacion.usecase.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { OPERACION_REPOSITORY } from '../tokens';
import type { OperacionRepositoryPort } from '../ports/operacion-repository.port';
import { UpdateOperacionDto } from '../dto/update-operacion.dto';

@Injectable()
export class UpdateOperacionUseCase {
  constructor(
    @Inject(OPERACION_REPOSITORY)
    private readonly repo: OperacionRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateOperacionDto) {
    const operacion = await this.repo.findById(id);
    if (!operacion) {
      throw new NotFoundException('Operación no encontrada');
    }

    /**
     * 🔒 Importante:
     * No cambiamos estado ni fechas acá
     * Solo campos administrativos permitidos
     */

    if (dto.medio !== undefined) {
      (operacion as any)._medio = dto.medio;
    }

    if (dto.observaciones !== undefined) {
      (operacion as any)._observaciones = dto.observaciones;
    }

    if (dto.compradorInquilinoId !== undefined) {
      (operacion as any)._compradorInquilinoId =
        dto.compradorInquilinoId ?? null;
    }

    if (dto.agenciaId !== undefined) {
      (operacion as any)._agenciaId = dto.agenciaId ?? null;
    }

    return this.repo.update(operacion);
  }
}
