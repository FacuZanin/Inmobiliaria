// backend/src/modules/listings/application/use-cases/update-listing.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { UpdateListingDto } from '@modules/listings/application/dto/update-listing.dto';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

@Injectable()
export class UpdateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    dto: UpdateListingDto,
  ): Promise<ListingAggregate> {
    const listing = await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.updateBasicInfo({
      title: dto.title,
      description: dto.description,
    });

    listing.updateFeatures({
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      rooms: dto.rooms,
      coveredArea: dto.coveredArea,
      totalArea: dto.totalArea,
    });

    listing.updateDetails(dto.details ?? {});

    return this.listingRepository.update(
      listing.id,
      listing,
    );
  }
}