import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../tokens';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { PropertyRepositoryPort } from '../../domain/repositories/property.repository.port';
import { PropertyAggregate } from '../../domain/aggregates/property.aggregate';
import { PropertyAddressVO } from '../../domain/value-objects/property-address.vo';
import { PropertyCoordinatesVO } from '../../domain/value-objects/property-coordinates.vo';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdatePropertyDto): Promise<PropertyAggregate> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    property.updateBasicInfo({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      operationType: dto.operationType,
    });

    if (dto.address || dto.coordinates !== undefined) {
      property.updateLocation({
        address: dto.address ? new PropertyAddressVO(dto.address) : undefined,
        coordinates: dto.coordinates
          ? new PropertyCoordinatesVO(
              dto.coordinates.latitude,
              dto.coordinates.longitude,
            )
          : dto.coordinates === null
            ? null
            : undefined,
      });
    }

    if (dto.pricing) {
      property.updatePricing(dto.pricing);
    }

    if (dto.features) {
      property.updateFeatures(dto.features);
    }

    if (dto.amenities) {
      property.updateAmenities(dto.amenities);
    }

    if (dto.details) {
      property.updateDetails(dto.details);
    }

    return this.propertyRepository.update(id, property);
  }
}
