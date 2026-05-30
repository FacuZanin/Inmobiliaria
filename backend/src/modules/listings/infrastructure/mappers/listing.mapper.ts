// backend/src/modules/listings/infrastructure/persistence/mappers/listing.mapper.ts

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '../entities/listing.orm-entity';
import { ListingMediaOrmEntity } from '../entities/listing-media.orm-entity';
import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

import { PricingVO } from '@modules/listings/domain/value-objects/pricing.vo';
import { LocationVO } from '@modules/listings/domain/value-objects/location.vo';
import { FeaturesVO } from '@modules/listings/domain/value-objects/features.vo';

export class ListingMapper {
  // =====================================================
  // ORM → DOMAIN
  // =====================================================

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

      pricing: new PricingVO({
        salePrice: entity.salePrice != null ? Number(entity.salePrice) : null,

        rentalPrice:
          entity.rentalPrice != null ? Number(entity.rentalPrice) : null,

        expenses: entity.expenses != null ? Number(entity.expenses) : null,
      }),

      location: new LocationVO({
        address: entity.address,

        city: entity.city,

        latitude: entity.latitude != null ? Number(entity.latitude) : null,

        longitude: entity.longitude != null ? Number(entity.longitude) : null,
      }),

      features: new FeaturesVO({
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
          return new ListingMediaEntity({
            id: media.id,

            listingId: media.listingId,

            type: media.type,

            url: media.url,

            thumbnailUrl: media.thumbnailUrl,

            filename: media.filename,

            mimeType: media.mimeType,

            size: media.size ? Number(media.size) : null,

            sortOrder: media.sortOrder,

            isPrimary: media.isPrimary,

            processingStatus: media.processingStatus,

            processingError: media.processingError,

            metadata: media.metadata,
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

  // =====================================================
  // DOMAIN → ORM
  // =====================================================

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

      // ===================================================
      // PRICING
      // ===================================================

      salePrice: aggregate.pricing.salePrice ?? null,

      rentalPrice: aggregate.pricing.rentalPrice ?? null,

      expenses: aggregate.pricing.expenses ?? null,

      // ===================================================
      // LOCATION
      // ===================================================

      address: aggregate.location.address ?? null,

      city: aggregate.location.city ?? null,

      latitude: aggregate.location.latitude ?? null,

      longitude: aggregate.location.longitude ?? null,

      // ===================================================
      // FEATURES
      // ===================================================

      rooms: aggregate.features.rooms ?? null,

      bedrooms: aggregate.features.bedrooms ?? null,

      bathrooms: aggregate.features.bathrooms ?? null,

      coveredArea: aggregate.features.coveredArea ?? null,

      totalArea: aggregate.features.totalArea ?? null,

      details: aggregate.details ?? {},

      // ===================================================
      // OWNER
      // ===================================================

      ownerId: aggregate.ownerId,

      agencyId: aggregate.agencyId ?? null,

      // ===================================================
      // MEDIA
      // ===================================================

      media: aggregate.media.map(
        (media): Partial<ListingMediaOrmEntity> => ({
          id: media.id ?? undefined,

          listingId: media.listingId,

          type: media.type,

          url: media.url,

          thumbnailUrl: media.thumbnailUrl ?? null,

          filename: media.filename ?? null,

          mimeType: media.mimeType ?? null,

          size: media.size ?? null,

          sortOrder: media.sortOrder,

          isPrimary: media.isPrimary,

          processingStatus: media.processingStatus,

          processingError: media.processingError ?? null,

          metadata: media.metadata ?? {},
        }),
      ) as ListingMediaOrmEntity[],

      // ===================================================
      // ANALYTICS
      // ===================================================

      viewsCount: aggregate.analytics.viewsCount,

      contactsCount: aggregate.analytics.contactsCount,

      favoritesCount: aggregate.analytics.favoritesCount,
    };
  }
}
