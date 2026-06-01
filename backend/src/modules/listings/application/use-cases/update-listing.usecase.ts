// backend/src/modules/listings/application/use-cases/update-listing.usecase.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { UpdateListingDto } from '@modules/listings/application/dto/update-listing.dto';

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingLocationVO } from '@modules/listings/domain/value-objects/listing-location.vo';
import { ListingAddressVO } from '@modules/listings/domain/value-objects/listing-address.vo';
import { ListingCoordinatesVO } from '@modules/listings/domain/value-objects/listing-coordinates.vo';

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

    if (dto.pricing) {
      listing.updatePricing(dto.pricing);
    }

    if (dto.location) {
      listing.updateLocation({
        address:
          dto.location.address && dto.location.city
            ? new ListingAddressVO({
                street: dto.location.address,

                city: dto.location.city,
              })
            : undefined,

        coordinates:
          dto.location.latitude != null && dto.location.longitude != null
            ? new ListingCoordinatesVO(
                dto.location.latitude,
                dto.location.longitude,
              )
            : undefined,
      });
    }

    if (dto.features) {
      listing.updateFeatures(dto.features);
    }

    if (dto.details !== undefined) {
      listing.updateDetails(dto.details);
    }

    return this.listingRepository.update(listingId, listing);
  }
}
