// backend/src/modules/listings/application/use-cases/create-listing.usecase.ts

import { Inject, Injectable, BadRequestException } from '@nestjs/common';

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

@Injectable()
export class CreateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    private readonly slugGenerator: ListingSlugGeneratorService,
  ) {}

  async execute(
    dto: CreateListingDto,
    ownerId: number,
  ): Promise<ListingAggregate> {
    if (!dto.title?.trim()) {
      throw new BadRequestException('Title is required');
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
}
