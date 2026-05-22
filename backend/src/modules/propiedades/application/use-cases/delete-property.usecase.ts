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

import { AuthorizationService } from '@/shared/security/services/authorization.service';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,

    private readonly authorizationService: AuthorizationService,
  ) {}

  async execute(id: number, user: User): Promise<void> {
    const property = await this.repo.findById(id);

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    this.authorizationService.assertCanDeleteProperty(user, property);

    await this.repo.softDelete(id);
  }
}
