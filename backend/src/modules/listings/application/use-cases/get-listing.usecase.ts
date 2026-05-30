// backend/src/modules/listings/application/use-cases/get-listing.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  LISTING_REPOSITORY,
} from '@modules/listings/application/tokens';

import { ListingRepositoryPort } from '../../domain/repositories/listing.repository.port';

@Injectable()
export class GetListingUseCase {
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

    return listing;
  }
}