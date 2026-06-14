import { MediaAssetEntity } from '@/modules/media/domain/entities/media-asset.entity';
import { MediaAssetOrmEntity } from '../persistence/typeorm/entities/media-asset.orm-entity';

export class MediaAssetMapper {
  static toDomain(entity: MediaAssetOrmEntity): MediaAssetEntity {
    return MediaAssetEntity.rehydrate({
      id: entity.id,
      ownerType: entity.ownerType,
      ownerId: entity.ownerId,
      type: entity.type,
      url: entity.url,
      storageKey: entity.storageKey,
      originalName: entity.originalName,
      mimeType: entity.mimeType,
      sizeInBytes: entity.sizeInBytes,
      uploadedById: entity.uploadedById,
      collection: entity.collection,
      status: entity.status,
      processingError: entity.processingError,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(asset: MediaAssetEntity): MediaAssetOrmEntity {
    const entity = new MediaAssetOrmEntity();

    entity.id = asset.id ?? undefined!;
    entity.ownerType = asset.ownerType;
    entity.ownerId = asset.ownerId;
    entity.type = asset.type;
    entity.url = asset.url;
    entity.storageKey = asset.storageKey;
    entity.originalName = asset.originalName;
    entity.mimeType = asset.mimeType;
    entity.sizeInBytes = asset.sizeInBytes;
    entity.uploadedById = asset.uploadedById;
    entity.collection = asset.collection ?? null;
    entity.status = asset.status;
    entity.processingError = asset.processingError ?? null;
    entity.metadata = asset.metadata ?? null;

    return entity;
  }
}
