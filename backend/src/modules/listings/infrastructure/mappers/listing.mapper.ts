// backend/src/modules/listings/infrastructure/mappers/listing.mapper.ts

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '../persistence/entities/listing.orm-entity';
import { ListingMediaOrmEntity } from '../persistence/entities/listing-media.orm-entity';
import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

import { ListingPricingVO } from '@modules/listings/domain/value-objects/listing-pricing.vo';
import { ListingLocationVO } from '@modules/listings/domain/value-objects/listing-location.vo';
import { ListingFeaturesVO } from '@modules/listings/domain/value-objects/listing-features.vo';
import { MediaMetadataVO } from '@modules/listings/domain/value-objects/media-metadata.vo';
import { ListingAddressVO } from '@modules/listings/domain/value-objects/listing-address.vo';
import { ListingCoordinatesVO } from '@modules/listings/domain/value-objects/listing-coordinates.vo';

export class ListingMapper {
  static toDomain(entity: ListingOrmEntity): ListingAggregate {
    return ListingAggregate.rehydrate({
      id: entity.id,

      title: entity.title,

      description: entity.description,

      category: entity.category,

      propertyType: entity.propertyType,

      operationType: entity.operationType,

      status: entity.status,

      moderationStatus: entity.moderationStatus,

      moderationReason: entity.moderationReason,

      visibility: entity.visibility,

      slug: entity.slug,

      pricing: new ListingPricingVO({
        salePrice: entity.salePrice,

        rentalPrice: entity.rentalPrice,

        expenses: entity.expenses,
      }),

      location: new ListingLocationVO({
        address:
          entity.address && entity.city
            ? new ListingAddressVO({
                street: entity.address,
                city: entity.city,
              })
            : null,

        coordinates:
          entity.latitude != null && entity.longitude != null
            ? new ListingCoordinatesVO(entity.latitude, entity.longitude)
            : null,
      }),

      features: new ListingFeaturesVO({
        rooms: entity.rooms,

        bedrooms: entity.bedrooms,

        bathrooms: entity.bathrooms,

        coveredArea: entity.coveredArea,

        totalArea: entity.totalArea,
      }),

      ownerId: entity.ownerId,

      agencyId: entity.agencyId,

      media:
        entity.media?.map((media) => {
          return ListingMediaEntity.rehydrate({
            id: media.id,

            listingId: media.listingId,

            type: media.type,

            url: media.url,

            storageKey: media.storageKey ?? media.url,

            thumbnailUrl: media.thumbnailUrl,

            filename: media.filename,

            mimeType: media.mimeType ?? 'application/octet-stream',

            sizeInBytes: media.size ?? null,

            sortOrder: media.sortOrder,

            isPrimary: media.isPrimary,

            processingStatus: media.processingStatus,

            processingError: media.processingError,

            metadata: media.metadata
              ? new MediaMetadataVO(media.metadata)
              : null,
          });
        }) ?? [],

      analytics: {
        viewsCount: entity.viewsCount,

        contactsCount: entity.contactsCount,

        favoritesCount: entity.favoritesCount,
      },

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(aggregate: ListingAggregate): Partial<ListingOrmEntity> {
    return {
      id: aggregate.id ?? undefined,

      title: aggregate.title,

      description: aggregate.description ?? null,

      category: aggregate.category,

      propertyType: aggregate.propertyType,

      operationType: aggregate.operationType,

      status: aggregate.status,

      moderationStatus: aggregate.moderationStatus,

      moderationReason: aggregate.moderationReason ?? null,

      visibility: aggregate.visibility,

      slug: aggregate.slug ?? null,

      salePrice: aggregate.pricing.salePrice ?? null,

      rentalPrice: aggregate.pricing.rentalPrice ?? null,

      expenses: aggregate.pricing.expenses ?? null,

      address: aggregate.location.address?.street ?? null,

      city: aggregate.location.address?.city ?? null,

      latitude: aggregate.location.coordinates?.latitude ?? null,

      longitude: aggregate.location.coordinates?.longitude ?? null,

      rooms: aggregate.features.rooms ?? null,

      bedrooms: aggregate.features.bedrooms ?? null,

      bathrooms: aggregate.features.bathrooms ?? null,

      coveredArea: aggregate.features.coveredArea ?? null,

      totalArea: aggregate.features.totalArea ?? null,

      details: aggregate.details ?? {},

      ownerId: aggregate.ownerId,

      agencyId: aggregate.agencyId ?? null,

      media: aggregate.media.map((media) => ({
        id: media.id ?? undefined,

        listingId: media.listingId ?? undefined,

        type: media.type,

        url: media.url,

        storageKey: media.storageKey,

        thumbnailUrl: media.thumbnailUrl ?? null,

        filename: media.filename ?? null,

        mimeType: media.mimeType ?? null,

        size: media.sizeInBytes ?? null,

        sortOrder: media.sortOrder,

        isPrimary: media.isPrimary,

        processingStatus: media.processingStatus,

        processingError: media.processingError ?? null,

        metadata: media.metadata?.toPrimitives() ?? null,
      })),

      viewsCount: aggregate.analytics.viewsCount,

      contactsCount: aggregate.analytics.contactsCount,

      favoritesCount: aggregate.analytics.favoritesCount,
    };
  }
}
