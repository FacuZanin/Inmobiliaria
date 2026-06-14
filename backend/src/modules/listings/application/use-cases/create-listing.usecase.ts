// backend/src/modules/listings/application/use-cases/create-listing.usecase.ts

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { CreateListingDto } from '@modules/listings/application/dto/create-listing.dto';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingPricingVO } from '@modules/listings/domain/value-objects/listing-pricing.vo';
import { ListingLocationVO } from '@modules/listings/domain/value-objects/listing-location.vo';
import { ListingFeaturesVO } from '@modules/listings/domain/value-objects/listing-features.vo';
import { ListingAddressVO } from '@modules/listings/domain/value-objects/listing-address.vo';
import { ListingCoordinatesVO } from '@modules/listings/domain/value-objects/listing-coordinates.vo';

import { ListingSlugGeneratorService } from '@modules/listings/domain/services/listing-slug-generator.service';
import { PROPERTY_REPOSITORY } from '@/modules/properties/application/tokens';
import { PropertyRepositoryPort } from '@/modules/properties/domain/repositories/property.repository.port';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';

@Injectable()
export class CreateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,

    private readonly slugGenerator: ListingSlugGeneratorService,
  ) {}

  async execute(
    dto: CreateListingDto,
    ownerId: number,
    agencyId?: number | null,
  ): Promise<ListingAggregate> {
    if (!dto.title?.trim()) {
      throw new BadRequestException('Title is required');
    }

    if (dto.propertyId) {
      const property = await this.propertyRepository.findById(dto.propertyId);

      if (!property) {
        throw new NotFoundException('Property not found');
      }

      const ownsProperty =
        property.ownerId === ownerId ||
        Boolean(agencyId && property.agencyId && property.agencyId === agencyId);

      if (!ownsProperty) {
        throw new ForbiddenException('You cannot publish this property');
      }

      if (this.mapPropertyType(property.type) !== dto.propertyType) {
        throw new BadRequestException('Listing property type does not match property');
      }

      if (this.mapOperationType(property.operationType) !== dto.operationType) {
        throw new BadRequestException('Listing operation type does not match property');
      }
    }

    const slug = await this.slugGenerator.generate({
      title: dto.title,

      city: dto.location?.city,

      propertyType: dto.propertyType,

      operationType: dto.operationType,
    });

    const listing = ListingAggregate.create({
      title: dto.title,

      description: dto.description ?? null,

      slug,

      propertyType: dto.propertyType,

      operationType: dto.operationType,

      ownerId,

      propertyId: dto.propertyId ?? null,

      agencyId: agencyId ?? null,

      pricing: new ListingPricingVO({
        salePrice: dto.pricing?.salePrice ?? null,

        rentalPrice: dto.pricing?.rentalPrice ?? null,

        expenses: dto.pricing?.expenses ?? null,
      }),

      location: new ListingLocationVO({
        address:
          dto.location?.address && dto.location?.city
            ? new ListingAddressVO({
                street: dto.location.address,

                city: dto.location.city,
              })
            : null,

        coordinates:
          dto.location?.latitude != null && dto.location?.longitude != null
            ? new ListingCoordinatesVO(
                dto.location.latitude,
                dto.location.longitude,
              )
            : null,
      }),

      features: new ListingFeaturesVO({
        bedrooms: dto.features?.bedrooms ?? null,

        bathrooms: dto.features?.bathrooms ?? null,

        rooms: dto.features?.rooms ?? null,

        coveredArea: dto.features?.coveredArea ?? null,

        totalArea: dto.features?.totalArea ?? null,
      }),

      details: dto.details ?? {},

      media: [],
    });

    return this.listingRepository.save(listing);
  }

  private mapPropertyType(type: PropiedadTipo) {
    const map = {
      [PropiedadTipo.CASA]: 'HOUSE',
      [PropiedadTipo.DEPARTAMENTO]: 'APARTMENT',
      [PropiedadTipo.LOTE]: 'LAND',
      [PropiedadTipo.LOCAL]: 'COMMERCIAL',
      [PropiedadTipo.OFICINA]: 'OFFICE',
      [PropiedadTipo.CAMPO]: 'FIELD',
      [PropiedadTipo.PH]: 'PH',
      [PropiedadTipo.POZO]: 'DEVELOPMENT',
    } as const;

    return map[type];
  }

  private mapOperationType(type: OperacionTipo) {
    const map = {
      [OperacionTipo.VENTA]: 'SALE',
      [OperacionTipo.ALQUILER]: 'RENT',
      [OperacionTipo.TEMPORAL]: 'TEMPORARY_RENT',
    } as const;

    return map[type];
  }
}
