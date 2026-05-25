// backend\src\modules\propiedades\application\use-cases\moderation\observe-property.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { PROPERTY_REPOSITORY } from '../../tokens';

import type { PropertyRepositoryPort }
from '@modules/propiedades/application/ports/property-repository.port';

@Injectable()
export class ObservePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository:
      PropertyRepositoryPort,
  ) {}

  async execute(
    id: number,
    reason?: string,
  ) {
    const property =
      await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException(
        'Propiedad no encontrada',
      );
    }

    property.observe(reason);

    return this.propertyRepository.save(
      property,
    );
  }
}