import { MediaAssetEntity } from '@/modules/media/domain/entities/media-asset.entity';

export class MediaAssetPresenter {
  static toHttp(asset: MediaAssetEntity) {
    return {
      id: asset.id,
      ownerType: asset.ownerType,
      ownerId: asset.ownerId,
      type: asset.type,
      url: asset.url,
      storageKey: asset.storageKey,
      originalName: asset.originalName,
      mimeType: asset.mimeType,
      sizeInBytes: asset.sizeInBytes,
      uploadedById: asset.uploadedById,
      collection: asset.collection,
      status: asset.status,
      processingError: asset.processingError,
      metadata: asset.metadata,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }
}
