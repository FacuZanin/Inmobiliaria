// backend/src/modules/listings/infrastructure/persistence/mappers/listing.mapper.ts

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '../entities/listing.orm-entity';

import { ListingMediaOrmEntity } from '../entities/listing-media.orm-entity';

import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

import { ListingPricingEntity } from '@modules/listings/domain/entities/listing-pricing.entity';

import { ListingLocationEntity } from '@modules/listings/domain/entities/listing-location.entity';

import { ListingFeaturesEntity } from '@modules/listings/domain/entities/listing-features.entity';

import { ListingOwnerEntity } from '@modules/listings/domain/entities/listing-owner.entity';

import { ListingPriceVO } from '@modules/listings/domain/value-objects/listing-price.vo';

import { AddressVO } from '@modules/listings/domain/value-objects/address.vo';

import { CoordinatesVO } from '@modules/listings/domain/value-objects/coordinates.vo';

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

      pricing: new ListingPricingEntity({
        salePrice:
          entity.salePrice != null
            ? new ListingPriceVO(Number(entity.salePrice))
            : null,

        rentalPrice:
          entity.rentalPrice != null
            ? new ListingPriceVO(Number(entity.rentalPrice))
            : null,

        expenses:
          entity.expenses != null
            ? new ListingPriceVO(Number(entity.expenses))
            : null,
      }),

      location: new ListingLocationEntity({
        address: entity.address
          ? new AddressVO(entity.address)
          : null,

        city: entity.city,

        coordinates:
          entity.latitude != null &&
          entity.longitude != null
            ? new CoordinatesVO(
                Number(entity.latitude),
                Number(entity.longitude),
              )
            : null,
      }),

      features: new ListingFeaturesEntity({
        rooms: entity.rooms,

        bedrooms: entity.bedrooms,

        bathrooms: entity.bathrooms,

        coveredArea: entity.coveredArea,

        totalArea: entity.totalArea,

        details: entity.details ?? {},
      }),

      owner: new ListingOwnerEntity({
        ownerId: entity.ownerId,

        agencyId: entity.agencyId,
      }),

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

            size: media.size
              ? Number(media.size)
              : null,

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

  static toOrm(
    aggregate: ListingAggregate,
  ): Partial<ListingOrmEntity> {
    return {
      id: aggregate.id ?? undefined,

      title: aggregate.title,

      description: aggregate.description ?? null,

      category: aggregate.category,

      propertyType: aggregate.propertyType,

      operationType: aggregate.operationType,

      status: aggregate.status,

      moderationStatus: aggregate.moderationStatus,

      moderationReason:
        aggregate.moderationReason ?? null,

      visibility: aggregate.visibility,

      slug: aggregate.slug ?? null,

      // ===================================================
      // PRICING
      // ===================================================

      salePrice:
        aggregate.pricing.salePrice?.value ?? null,

      rentalPrice:
        aggregate.pricing.rentalPrice?.value ?? null,

      expenses:
        aggregate.pricing.expenses?.value ?? null,

      // ===================================================
      // LOCATION
      // ===================================================

      address:
        aggregate.location.address?.toString() ?? null,

      city: aggregate.location.city ?? null,

      latitude:
        aggregate.location.coordinates?.latitude ??
        null,

      longitude:
        aggregate.location.coordinates?.longitude ??
        null,

      // ===================================================
      // FEATURES
      // ===================================================

      rooms: aggregate.features.rooms ?? null,

      bedrooms:
        aggregate.features.bedrooms ?? null,

      bathrooms:
        aggregate.features.bathrooms ?? null,

      coveredArea:
        aggregate.features.coveredArea ?? null,

      totalArea:
        aggregate.features.totalArea ?? null,

      details:
        aggregate.features.details ?? {},

      // ===================================================
      // OWNER
      // ===================================================

      ownerId: aggregate.owner.ownerId,

      agencyId:
        aggregate.owner.agencyId ?? null,

      // ===================================================
      // MEDIA
      // ===================================================

      media: aggregate.media.map(
        (
          media,
        ): Partial<ListingMediaOrmEntity> => ({
          id: media.id ?? undefined,

          listingId: media.listingId,

          type: media.type,

          url: media.url,

          thumbnailUrl:
            media.thumbnailUrl ?? null,

          filename: media.filename ?? null,

          mimeType: media.mimeType ?? null,

          size: media.size ?? null,

          sortOrder: media.sortOrder,

          isPrimary: media.isPrimary,

          processingStatus:
            media.processingStatus,

          processingError:
            media.processingError ?? null,

          metadata: media.metadata ?? {},
        }),
      ) as ListingMediaOrmEntity[],

      // ===================================================
      // ANALYTICS
      // ===================================================

      viewsCount:
        aggregate.analytics.viewsCount,

      contactsCount:
        aggregate.analytics.contactsCount,

      favoritesCount:
        aggregate.analytics.favoritesCount,
    };
  }
}