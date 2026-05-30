// backend/src/modules/listings/application/use-cases/create-listing.usecase.ts

import {
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { CreateListingDto } from '@modules/listings/application/dto/create-listing.dto';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';

@Injectable()
export class CreateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    dto: CreateListingDto,
    ownerId: number,
  ): Promise<ListingAggregate> {
    if (!dto.title) {
      throw new BadRequestException('Title is required');
    }

    const listing = ListingAggregate.create({
      title: dto.title,
      description: dto.description,
      propertyType: dto.propertyType,
      operationType: dto.operationType,

      ownerId,

      status: ListingStatus.DRAFT,

      pricing: {
        salePrice: dto.salePrice ?? null,
        rentalPrice: dto.rentalPrice ?? null,
        expenses: dto.expenses ?? null,
      },

      location: {
        address: dto.address,
        city: dto.city,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },

      features: {
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        rooms: dto.rooms,
        coveredArea: dto.coveredArea,
        totalArea: dto.totalArea,
      },

      details: dto.details ?? {},

      media: [],
    });

    return this.listingRepository.save(listing);
  }
}