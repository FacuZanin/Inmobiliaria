// backend/src/modules/listings/application/use-cases/update-location.usecase.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';

import { ListingAddressVO } from '@modules/listings/domain/value-objects/listing-address.vo';
import { ListingCoordinatesVO } from '@modules/listings/domain/value-objects/listing-coordinates.vo';

@Injectable()
export class UpdateLocationUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    location: {
      address?: string;
      city?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    const listing = await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.updateLocation({
      address:
        location.address && location.city
          ? new ListingAddressVO({
              street: location.address,

              city: location.city,
            })
          : undefined,

      coordinates:
        location.latitude != null && location.longitude != null
          ? new ListingCoordinatesVO(location.latitude, location.longitude)
          : undefined,
    });

    return this.listingRepository.update(listingId, listing);
  }
}
