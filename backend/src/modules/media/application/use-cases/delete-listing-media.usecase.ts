import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import { ListingOwnershipPolicy } from '@/modules/listings/application/policies/listing-ownership.policy';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';
import { MediaAssetRepositoryPort } from '@/modules/media/domain/repositories/media-asset.repository.port';
import {
  MEDIA_ASSET_REPOSITORY,
  MEDIA_STORAGE,
} from '../tokens';
import type { MediaStoragePort } from '../ports/media-storage.port';

@Injectable()
export class DeleteListingMediaUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly mediaRepository: MediaAssetRepositoryPort,

    @Inject(MEDIA_STORAGE)
    private readonly storage: MediaStoragePort,
  ) {}

  async execute(
    listingId: number,
    mediaId: number,
    user: JwtPayload & { id?: number },
  ) {
    const listing = await this.listingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    ListingOwnershipPolicy.assertCanModify(user, listing);

    const media = listing.media.find((item) => item.id === mediaId);

    if (!media) {
      throw new NotFoundException('Listing media not found');
    }

    const asset = await this.mediaRepository.findByStorageKey(media.storageKey);

    if (asset) {
      await this.storage.delete(asset.storageKey);
      await this.mediaRepository.delete(asset.id!);
    } else {
      await this.storage.delete(media.storageKey);
    }

    listing.removeMedia(mediaId);

    return this.listingRepository.update(listingId, listing);
  }
}
