import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MediaAssetRepositoryPort } from '@/modules/media/domain/repositories/media-asset.repository.port';
import { MEDIA_ASSET_REPOSITORY } from '../tokens';

@Injectable()
export class GetMediaUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
  ) {}

  async execute(id: number) {
    const asset = await this.repository.findById(id);

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    return asset;
  }
}
