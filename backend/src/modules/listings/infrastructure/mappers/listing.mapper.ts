// backend/src/modules/listings/infrastructure/mappers/listing.mapper.ts

import { ListingAggregate } from '@modules/listings/domain/aggregates/listing.aggregate';

import { ListingOrmEntity } from '../persistence/typeorm/entities/listing.orm-entity';

import { ListingFeaturesVO } from '@modules/listings/domain/value-objects/listing-features.vo';

import { ListingMediaMapper } from './listing-media.mapper';
import { ListingPricingMapper } from './listing-pricing.mapper';
import { ListingLocationMapper } from './listing-location.mapper';

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

      pricing: ListingPricingMapper.toDomain(entity),

      location: ListingLocationMapper.toDomain(entity),

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
        entity.media?.map((media) => ListingMediaMapper.toDomain(media)) ?? [],

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
    const ormEntity = new ListingOrmEntity();

    ormEntity.id = aggregate.id ?? undefined!;

    ormEntity.title = aggregate.title;

    ormEntity.description = aggregate.description ?? null;

    ormEntity.category = aggregate.category;

    ormEntity.propertyType = aggregate.propertyType;

    ormEntity.operationType = aggregate.operationType;

    ormEntity.status = aggregate.status;

    ormEntity.moderationStatus = aggregate.moderationStatus;

    ormEntity.moderationReason = aggregate.moderationReason ?? null;

    ormEntity.visibility = aggregate.visibility;

    ormEntity.slug = aggregate.slug ?? null;

    Object.assign(ormEntity, ListingPricingMapper.toOrm(aggregate.pricing));

    Object.assign(ormEntity, ListingLocationMapper.toOrm(aggregate.location));

    ormEntity.rooms = aggregate.features.rooms ?? null;

    ormEntity.bedrooms = aggregate.features.bedrooms ?? null;

    ormEntity.bathrooms = aggregate.features.bathrooms ?? null;

    ormEntity.coveredArea = aggregate.features.coveredArea ?? null;

    ormEntity.totalArea = aggregate.features.totalArea ?? null;

    ormEntity.details = aggregate.details ?? {};

    ormEntity.ownerId = aggregate.ownerId;

    ormEntity.agencyId = aggregate.agencyId ?? null;

    ormEntity.media = aggregate.media.map((media) =>
      ListingMediaMapper.toOrm(media),
    );

    ormEntity.viewsCount = aggregate.analytics.viewsCount;

    ormEntity.contactsCount = aggregate.analytics.contactsCount;

    ormEntity.favoritesCount = aggregate.analytics.favoritesCount;

    return ormEntity;
  }
}
