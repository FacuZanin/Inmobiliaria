import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../tokens';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { PropertyRepositoryPort } from '../../domain/repositories/property.repository.port';
import { PropertyAggregate } from '../../domain/aggregates/property.aggregate';
import { PropertyAddressVO } from '../../domain/value-objects/property-address.vo';
import { PropertyCoordinatesVO } from '../../domain/value-objects/property-coordinates.vo';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}

  async execute(
    dto: CreatePropertyDto,
    ownerId: number,
    agencyId?: number | null,
  ): Promise<PropertyAggregate> {
    const property = PropertyAggregate.create({
      title: dto.title,
      description: dto.description ?? null,
      type: dto.type,
      operationType: dto.operationType,
      ownerId,
      agencyId: agencyId ?? null,
      address: new PropertyAddressVO(dto.address),
      coordinates: dto.coordinates
        ? new PropertyCoordinatesVO(
            dto.coordinates.latitude,
            dto.coordinates.longitude,
          )
        : null,
      pricing: dto.pricing,
      features: dto.features,
      amenities: dto.amenities,
      details: dto.details,
    });

    return this.propertyRepository.save(property);
  }
}
