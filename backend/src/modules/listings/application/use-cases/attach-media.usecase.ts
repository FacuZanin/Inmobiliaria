// backend/src/modules/listings/application/use-cases/attach-media.usecase.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';
import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';
import { ListingMediaType } from '@modules/listings/domain/enums/listing-media-type.enum';

@Injectable()
export class AttachMediaUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async execute(
    listingId: number,
    media: {
      url: string;
      type: ListingMediaType;
      storageKey?: string;
      mimeType?: string;
      sizeInBytes?: number | null;
      isPrimary?: boolean;
      thumbnailUrl?: string | null;
      filename?: string | null;
    }[],
  ) {
    const listing =
      await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.attachMedia(
      media.map((item) =>
        ListingMediaEntity.create({
          url: item.url,
          type: item.type,
          storageKey: item.storageKey ?? item.url,
          mimeType: item.mimeType ?? 'application/octet-stream',
          sizeInBytes: item.sizeInBytes ?? null,
          isPrimary: item.isPrimary ?? false,
          thumbnailUrl: item.thumbnailUrl ?? null,
          filename: item.filename ?? null,
        }),
      ),
    );

    return this.listingRepository.update(
      listingId,
      listing,
    );
  }
}
