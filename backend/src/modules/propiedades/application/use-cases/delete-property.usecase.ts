// backend\src\modules\propiedades\application\use-cases\delete-property.usecase.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import { PROPERTY_REPOSITORY } from '../tokens';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Propiedad no encontrada');
    await this.repo.delete(id);
  }
}
