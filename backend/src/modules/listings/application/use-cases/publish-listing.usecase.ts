// backend/src/modules/listings/application/use-cases/publish-listing.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/listings.tokens';

import { ListingRepositoryPort } from '../../domain/repositories/listing.repository.port';

@Injectable()
export class PublishListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly repository: ListingRepositoryPort,
  ) {}

  async execute(id: number) {
    const listing =
      await this.repository.findById(id);

    if (!listing) {
      throw new NotFoundException(
        'Listing not found',
      );
    }

    listing.publish();

    return this.repository.save(listing);
  }
}