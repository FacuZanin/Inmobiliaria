import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaAssetRepositoryPort } from '@/modules/media/domain/repositories/media-asset.repository.port';
import {
  MEDIA_ASSET_REPOSITORY,
  MEDIA_STORAGE,
} from '../tokens';
import type { MediaStoragePort } from '../ports/media-storage.port';

@Injectable()
export class DeleteMediaUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,

    @Inject(MEDIA_STORAGE)
    private readonly storage: MediaStoragePort,
  ) {}

  async execute(id: number, userId: number) {
    const asset = await this.repository.findById(id);

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    if (asset.uploadedById !== userId && asset.ownerId !== userId) {
      throw new ForbiddenException('You cannot delete this media asset');
    }

    await this.storage.delete(asset.storageKey);
    await this.repository.delete(id);

    return {
      success: true,
    };
  }
}
