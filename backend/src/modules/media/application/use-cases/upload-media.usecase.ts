import { Inject, Injectable } from '@nestjs/common';
import { MediaAssetEntity } from '@/modules/media/domain/entities/media-asset.entity';
import { MediaAssetType } from '@/modules/media/domain/enums/media-asset-type.enum';
import { MediaOwnerType } from '@/modules/media/domain/enums/media-owner-type.enum';
import { MediaAssetRepositoryPort } from '@/modules/media/domain/repositories/media-asset.repository.port';
import { MediaFileValidatorService } from '../services/media-file-validator.service';
import {
  MEDIA_ASSET_REPOSITORY,
  MEDIA_PROCESSING_QUEUE,
  MEDIA_STORAGE,
} from '../tokens';
import type { MediaProcessingQueuePort } from '../ports/media-processing-queue.port';
import type { MediaStoragePort } from '../ports/media-storage.port';

export type UploadMediaInput = {
  ownerType: MediaOwnerType;
  ownerId: number;
  uploadedById: number;
  collection?: string | null;
  file: Express.Multer.File;
};

@Injectable()
export class UploadMediaUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,

    @Inject(MEDIA_STORAGE)
    private readonly storage: MediaStoragePort,

    @Inject(MEDIA_PROCESSING_QUEUE)
    private readonly processingQueue: MediaProcessingQueuePort,

    private readonly validator: MediaFileValidatorService,
  ) {}

  async execute(input: UploadMediaInput): Promise<MediaAssetEntity> {
    this.validator.validateImage(input.file);

    const folder = [
      input.ownerType.toLowerCase(),
      String(input.ownerId),
      input.collection ?? 'default',
    ].join('/');

    const stored = await this.storage.save(
      {
        originalName: input.file.originalname,
        mimeType: input.file.mimetype,
        buffer: input.file.buffer,
        size: input.file.size,
      },
      folder,
    );

    const created = await this.repository.save(
      MediaAssetEntity.create({
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        type: MediaAssetType.IMAGE,
        url: stored.url,
        storageKey: stored.storageKey,
        originalName: input.file.originalname,
        mimeType: input.file.mimetype,
        sizeInBytes: input.file.size,
        uploadedById: input.uploadedById,
        collection: input.collection ?? null,
        metadata: null,
      }),
    );

    if (created.id) {
      await this.processingQueue.enqueue({
        mediaId: created.id,
      });
    }

    return created;
  }
}
