import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';
import { PROPERTY_REPOSITORY } from '../tokens';
import { PropertyAggregate } from '../../domain/aggregates/property.aggregate';
import { PropertyRepositoryPort } from '../../domain/repositories/property.repository.port';

@Injectable()
export class ChangePropertyStatusUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}

  async execute(id: number, status: PropertyStatus): Promise<PropertyAggregate> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    property.changeStatus(status);

    return this.propertyRepository.update(id, property);
  }
}
