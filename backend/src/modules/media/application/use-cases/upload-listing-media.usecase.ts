import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import { ListingMediaEntity } from '@/modules/listings/domain/entities/listing-media.entity';
import { ListingMediaType } from '@/modules/listings/domain/enums/listing-media-type.enum';
import { ListingOwnershipPolicy } from '@/modules/listings/application/policies/listing-ownership.policy';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';
import { MediaOwnerType } from '@/modules/media/domain/enums/media-owner-type.enum';
import { UploadMediaUseCase } from './upload-media.usecase';

@Injectable()
export class UploadListingMediaUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    private readonly uploadMedia: UploadMediaUseCase,
  ) {}

  async execute(params: {
    listingId: number;
    file: Express.Multer.File;
    user: JwtPayload & { id?: number };
    isPrimary?: boolean;
  }) {
    const listing = await this.listingRepository.findById(params.listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    ListingOwnershipPolicy.assertCanModify(params.user, listing);

    const userId = params.user.id ?? params.user.sub;
    const shouldBePrimary = params.isPrimary ?? listing.media.length === 0;
    const asset = await this.uploadMedia.execute({
      ownerType: MediaOwnerType.LISTING,
      ownerId: params.listingId,
      uploadedById: userId,
      collection: 'gallery',
      file: params.file,
    });

    listing.attachMedia([
      ListingMediaEntity.create({
        type: ListingMediaType.IMAGE,
        url: asset.url,
        storageKey: asset.storageKey,
        mimeType: asset.mimeType,
        sizeInBytes: asset.sizeInBytes,
        isPrimary: shouldBePrimary,
        filename: asset.originalName,
        thumbnailUrl: null,
      }),
    ]);

    return this.listingRepository.update(params.listingId, listing);
  }
}
