// backend\src\modules\operaciones\application\use-cases\create-operacion.usecase.ts
import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OPERACION_REPOSITORY } from '../tokens';

import type { OperacionRepositoryPort } from '../ports/operacion-repository.port';
import { CreateOperacionDto } from '../dto/create-operacion.dto';
import { OperacionAggregate } from '../../domain/entities/operacion.aggregate';
import { User } from '@/modules/users/domain/entities/user.entity';
import { getUserTypeCapabilities } from '@/modules/users/domain/capabilities/property-publishers';

@Injectable()
export class CreateOperacionUseCase {
  constructor(
    @Inject(OPERACION_REPOSITORY)
    private readonly repo: OperacionRepositoryPort,
  ) {}

  async execute(dto: CreateOperacionDto, currentUser: User) {
    const userCapabilities = getUserTypeCapabilities(currentUser.tipo);
    const resolvedAgencyId = userCapabilities.requiresAgencyOnApproval
      ? currentUser.agencia?.id ?? null
      : null;

    if (!userCapabilities.canCreateOperations) {
      throw new ForbiddenException(
        'Tu tipo de cuenta no puede crear operaciones',
      );
    }

    if (
      dto.agenciaId !== undefined &&
      dto.agenciaId !== null &&
      dto.agenciaId !== resolvedAgencyId
    ) {
      throw new ForbiddenException(
        'No puedes crear operaciones para una agencia distinta',
      );
    }

    if (
      userCapabilities.requiresAgencyOnApproval &&
      resolvedAgencyId === null
    ) {
      throw new BadRequestException(
        'El perfil profesional requiere una agencia asociada para operar',
      );
    }

    const operacion = OperacionAggregate.create({
      tipo: dto.tipo,
      medio: dto.medio ?? null,
      propiedadId: dto.propiedadId,
      agenciaId: resolvedAgencyId,
      propietarioDirectoId: dto.propietarioDirectoId ?? null,
      creadoPorId: currentUser.id,
      compradorInquilinoId: dto.compradorInquilinoId ?? null,

      observaciones: dto.observaciones ?? null,
    });

    return this.repo.save(operacion);
  }
}
