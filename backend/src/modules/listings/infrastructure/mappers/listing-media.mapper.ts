// backend\src\modules\listings\infrastructure\mappers\listing-media.mapper.ts
import { ListingMediaOrmEntity } from '../persistence/entities/listing-media.orm-entity';

import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

import { MediaMetadataVO } from '@modules/listings/domain/value-objects/media-metadata.vo';

export class ListingMediaMapper {
  static toDomain(
    entity: ListingMediaOrmEntity,
  ): ListingMediaEntity {
    return ListingMediaEntity.rehydrate({
      id: entity.id,

      listingId: entity.listingId,

      type: entity.type,

      url: entity.url,

      storageKey: entity.storageKey ?? entity.url,

      thumbnailUrl: entity.thumbnailUrl,

      filename: entity.filename,

      mimeType:
        entity.mimeType ?? 'application/octet-stream',

      sizeInBytes: entity.size ?? null,

      sortOrder: entity.sortOrder,

      isPrimary: entity.isPrimary,

      processingStatus: entity.processingStatus,

      processingError: entity.processingError,

      metadata: entity.metadata
        ? new MediaMetadataVO(entity.metadata)
        : null,
    });
  }

  static toOrm(
    media: ListingMediaEntity,
  ): ListingMediaOrmEntity {
    const mediaOrm = new ListingMediaOrmEntity();

    mediaOrm.id = media.id ?? undefined!;

    mediaOrm.listingId =
      media.listingId ?? undefined!;

    mediaOrm.type = media.type;

    mediaOrm.url = media.url;

    mediaOrm.storageKey = media.storageKey;

    mediaOrm.thumbnailUrl =
      media.thumbnailUrl ?? null;

    mediaOrm.filename =
      media.filename ?? null;

    mediaOrm.mimeType =
      media.mimeType ?? null;

    mediaOrm.size =
      media.sizeInBytes ?? null;

    mediaOrm.sortOrder = media.sortOrder;

    mediaOrm.isPrimary = media.isPrimary;

    mediaOrm.processingStatus =
      media.processingStatus;

    mediaOrm.processingError =
      media.processingError ?? null;

    mediaOrm.metadata =
      media.metadata?.toPrimitives() ?? null;

    return mediaOrm;
  }
}