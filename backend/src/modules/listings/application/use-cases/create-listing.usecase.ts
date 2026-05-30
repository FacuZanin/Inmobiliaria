// backend/src/modules/listings/application/use-cases/create-listing.usecase.ts

import {
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import {
  LISTING_REPOSITORY,
} from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { CreateListingDto } from '@modules/listings/application/dto/create-listing.dto';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { PricingVO } from '@modules/listings/domain/value-objects/pricing.vo';

import { LocationVO } from '@modules/listings/domain/value-objects/location.vo';

import { FeaturesVO } from '@modules/listings/domain/value-objects/features.vo';

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
    // =====================================================
    // VALIDATIONS
    // =====================================================

    if (!dto.title?.trim()) {
      throw new BadRequestException(
        'Title is required',
      );
    }

    // =====================================================
    // GENERATE SEO SLUG
    // =====================================================

    const slug =
      await this.slugGenerator.generate({
        title: dto.title,

        city: dto.city,

        propertyType: dto.propertyType,

        operationType: dto.operationType,
      });

    // =====================================================
    // CREATE AGGREGATE
    // =====================================================

    const listing = ListingAggregate.create({
      title: dto.title,

      description: dto.description ?? null,

      slug,

      propertyType: dto.propertyType,

      operationType: dto.operationType,

      ownerId,

      pricing: new PricingVO({
        salePrice:
          dto.salePrice ?? null,

        rentalPrice:
          dto.rentalPrice ?? null,

        expenses:
          dto.expenses ?? null,
      }),

      location: new LocationVO({
        address:
          dto.address ?? null,

        city: dto.city ?? null,

        latitude:
          dto.latitude ?? null,

        longitude:
          dto.longitude ?? null,
      }),

      features: new FeaturesVO({
        bedrooms:
          dto.bedrooms ?? null,

        bathrooms:
          dto.bathrooms ?? null,

        rooms:
          dto.rooms ?? null,

        coveredArea:
          dto.coveredArea ?? null,

        totalArea:
          dto.totalArea ?? null,
      }),

      details: dto.details ?? {},

      media: [],
    });

    // =====================================================
    // SAVE
    // =====================================================

    return this.listingRepository.save(
      listing,
    );
  }
}