// backend\src\modules\propiedades\application\use-cases\view-property.usecase.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../tokens';
import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import { PropertyAggregate } from '../../domain/entities/property.aggregate';

@Injectable()
export class ViewPropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(id: number): Promise<PropertyAggregate> {
    const prop = await this.repo.findById(id);
    if (!prop) throw new NotFoundException('Propiedad no encontrada');
    return prop;
  }
}
