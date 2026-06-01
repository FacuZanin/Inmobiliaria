// backend\src\modules\listings\domain\aggregates\listing.aggregate.ts

import { BadRequestException } from '@nestjs/common';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { PropertyType } from '@modules/listings/domain/enums/property-type.enum';
import { OperationType } from '@modules/listings/domain/enums/operation-type.enum';
import { ListingCategory } from '@modules/listings/domain/enums/listing-category.enum';
import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';
import { MediaProcessingStatus } from '@modules/listings/domain/enums/media-processing-status.enum';

import type { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

import { PricingVO } from '../value-objects/pricing.vo';
import { LocationVO } from '../value-objects/location.vo';
import { FeaturesVO } from '../value-objects/features.vo';

type ListingAggregateProps = {
  id?: number | null;

  title: string;

  description?: string | null;

  propertyType: PropertyType;

  operationType: OperationType;

  ownerId: number;

  agencyId?: number | null;

  status?: ListingStatus;

  moderationStatus?: ModerationStatus;

  moderationReason?: string | null;

  pricing?: PricingVO | {
    salePrice?: number | null;
    rentalPrice?: number | null;
    expenses?: number | null;
  };

  location?: LocationVO | {
    address?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };

  features?: FeaturesVO | {
    rooms?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    coveredArea?: number | null;
    totalArea?: number | null;
  };

  details?: Record<string, any>;

  media?: ListingMediaEntity[];

  createdAt?: Date;

  updatedAt?: Date;

  category?: ListingCategory;

  visibility?: ListingVisibility;

  slug?: string | null;

  analytics?: {
    viewsCount: number;
    contactsCount: number;
    favoritesCount: number;
  };
};

export class ListingAggregate {
  private _id: number | null;

  private _title: string;

  private _description: string | null;

  private _category: ListingCategory;

  private _propertyType: PropertyType;

  private _operationType: OperationType;

  private _ownerId: number;

  private _agencyId: number | null;

  private _status: ListingStatus;

  private _moderationStatus: ModerationStatus;

  private _moderationReason: string | null;

  private _visibility: ListingVisibility;

  private _slug: string | null;

  private _pricing: PricingVO;

  private _location: LocationVO;

  private _features: FeaturesVO;

  private _details: Record<string, any>;

  private _media: ListingMediaEntity[];

  private _analytics: {
    viewsCount: number;
    contactsCount: number;
    favoritesCount: number;
  };

  private _createdAt?: Date;

  private _updatedAt?: Date;

  private constructor(props: ListingAggregateProps) {
    this._id = props.id ?? null;

    this._title = props.title;

    this._description = props.description ?? null;

    this._category = props.category ?? ListingCategory.REAL_ESTATE;

    this._propertyType = props.propertyType;

    this._operationType = props.operationType;

    this._ownerId = props.ownerId;

    this._agencyId = props.agencyId ?? null;

    this._status = props.status ?? ListingStatus.DRAFT;

    this._moderationStatus =
      props.moderationStatus ?? ModerationStatus.PENDING_REVIEW;

    this._moderationReason = props.moderationReason ?? null;

    this._visibility = props.visibility ?? ListingVisibility.PUBLIC;

    this._slug = props.slug ?? null;

    this._pricing =
      props.pricing instanceof PricingVO
        ? props.pricing
        : new PricingVO(props.pricing ?? {});

    this._location =
      props.location instanceof LocationVO
        ? props.location
        : new LocationVO(props.location ?? {});

    this._features =
      props.features instanceof FeaturesVO
        ? props.features
        : new FeaturesVO(props.features ?? {});

    this._details = props.details ?? {};

    this._media = props.media ?? [];

    this._analytics = props.analytics ?? {
      viewsCount: 0,
      contactsCount: 0,
      favoritesCount: 0,
    };

    this._createdAt = props.createdAt;

    this._updatedAt = props.updatedAt;
  }

  // =====================================================
  // FACTORIES
  // =====================================================

  static create(
    props: Omit<
      ListingAggregateProps,
      | 'id'
      | 'status'
      | 'moderationStatus'
      | 'moderationReason'
      | 'createdAt'
      | 'updatedAt'
    >,
  ) {
    return new ListingAggregate({
      ...props,
      status: ListingStatus.DRAFT,
      moderationStatus: ModerationStatus.PENDING_REVIEW,
    });
  }

  static rehydrate(props: ListingAggregateProps) {
    return new ListingAggregate(props);
  }

  // =====================================================
  // GETTERS
  // =====================================================

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get propertyType() {
    return this._propertyType;
  }

  get operationType() {
    return this._operationType;
  }

  get ownerId() {
    return this._ownerId;
  }

  get agencyId() {
    return this._agencyId;
  }

  get status() {
    return this._status;
  }

  get moderationStatus() {
    return this._moderationStatus;
  }

  get moderationReason() {
    return this._moderationReason;
  }

  get pricing() {
    return this._pricing;
  }

  get location() {
    return this._location;
  }

  get features() {
    return this._features;
  }

  get details() {
    return this._details;
  }

  get media() {
    return this._media;
  }

  get category() {
    return this._category;
  }

  get visibility() {
    return this._visibility;
  }

  get slug() {
    return this._slug;
  }

  get analytics() {
    return this._analytics;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  incrementViews() {
    this._analytics.viewsCount += 1;
  }

  incrementContacts() {
    this._analytics.contactsCount += 1;
  }

  syncFavorites(count: number) {
    this._analytics.favoritesCount = count;
  }

  setSlug(slug: string) {
    this._slug = slug;
  }

  makePrivate() {
    this._visibility = ListingVisibility.PRIVATE;
  }

  makePublic() {
    this._visibility = ListingVisibility.PUBLIC;
  }

  removeMedia(mediaId: number) {
    this._media = this._media.filter((media) => media.id !== mediaId);
  }

  // =====================================================
  // BUSINESS RULES
  // =====================================================

  publish() {
    // =====================================================
    // MODERATION VALIDATION
    // =====================================================

    if (this._moderationStatus !== ModerationStatus.APPROVED) {
      throw new BadRequestException(
        'Listing must be approved before publishing',
      );
    }

    // =====================================================
    // MEDIA VALIDATION
    // =====================================================

    const readyMedia = this._media.filter(
      (media) => media.processingStatus === MediaProcessingStatus.READY,
    );

    if (!readyMedia.length) {
      throw new BadRequestException(
        'Listing requires processed media before publishing',
      );
    }

    // =====================================================
    // PRICING VALIDATION
    // =====================================================

    if (!this._pricing.hasValidPrice()) {
      throw new BadRequestException(
        'Listing requires pricing before publishing',
      );
    }

    // =====================================================
    // LOCATION VALIDATION
    // =====================================================

    if (!this._location.hasValidAddress()) {
      throw new BadRequestException(
        'Listing requires location before publishing',
      );
    }

    // =====================================================
    // STATUS TRANSITION
    // =====================================================

    this._status = ListingStatus.ACTIVE;
  }

  pause() {
    if (this._status !== ListingStatus.ACTIVE) {
      throw new BadRequestException('Only active listings can be paused');
    }

    this._status = ListingStatus.PAUSED;
  }

  archive() {
    this._status = ListingStatus.ARCHIVED;
  }

  approveModeration() {
    this._moderationStatus = ModerationStatus.APPROVED;

    this._moderationReason = null;
  }

  rejectModeration(reason: string) {
    this._moderationStatus = ModerationStatus.REJECTED;

    this._moderationReason = reason;
  }

  observeModeration(reason: string) {
    this._moderationStatus = ModerationStatus.OBSERVED;

    this._moderationReason = reason;
  }

  suspendModeration(reason: string) {
    this._moderationStatus = ModerationStatus.SUSPENDED;

    this._moderationReason = reason;
  }

  markAsUnderReview() {
    this._moderationStatus = ModerationStatus.PENDING_REVIEW;
  }

  // =====================================================
  // UPDATE METHODS
  // =====================================================

  updateBasicInfo(data: { title?: string; description?: string | null }) {
    if (data.title !== undefined) {
      this._title = data.title;
    }

    if (data.description !== undefined) {
      this._description = data.description;
    }
  }

  updatePricing(pricing: {
    salePrice?: number | null;
    rentalPrice?: number | null;
    expenses?: number | null;
  }) {
    this._pricing = new PricingVO({
      ...this._pricing.toPrimitives(),
      ...pricing,
    });
  }

  updateLocation(location: {
    address?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) {
    this._location = new LocationVO({
      ...this._location.toPrimitives(),
      ...location,
    });
  }

  updateFeatures(features: {
    rooms?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    coveredArea?: number | null;
    totalArea?: number | null;
  }) {
    this._features = new FeaturesVO({
      ...this._features.toPrimitives(),
      ...features,
    });
  }

  updateDetails(details: Record<string, any>) {
    this._details = details;
  }

  attachMedia(media: ListingMediaEntity[]) {
    for (const item of media) {
      const alreadyExists = this._media.some((m) => m.url === item.url);

      if (alreadyExists) {
        continue;
      }

      if (item.isPrimary) {
        this.clearPrimaryMedia();
      }

      this._media.push(item);
    }

    this.normalizeMediaOrder();
  }

  setId(id: number) {
    if (!this._id) {
      this._id = id;
    }
  }

  private clearPrimaryMedia() {
    this._media.forEach((media) => {
      media.removeAsPrimary();
    });
  }

  private normalizeMediaOrder() {
    this._media.forEach((media, index) => {
      media.updateSortOrder(index);
    });
  }
}
