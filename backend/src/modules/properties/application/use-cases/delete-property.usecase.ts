import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../tokens';
import { PropertyRepositoryPort } from '../../domain/repositories/property.repository.port';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    await this.propertyRepository.delete(id);
  }
}
