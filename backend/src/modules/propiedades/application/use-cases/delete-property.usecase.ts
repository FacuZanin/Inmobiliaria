// backend\src\modules\propiedades\application\use-cases\delete-property.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import { PROPERTY_REPOSITORY } from '../tokens';
import { User } from '../../../user/domain/entities/user.entity';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(id: number, user: User): Promise<void> {
    const property = await this.repo.findById(id);

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    const isSuperAdmin = user.role === UserRole.SUPERADMIN;

    const isOwner =
      property.creadoPorId === user.id ||
      property.agenciaId === user.agencia?.id;

    if (!isSuperAdmin && !isOwner) {
      throw new ForbiddenException('No puedes eliminar esta propiedad');
    }

    await this.repo.softDelete(id);
  }
}
