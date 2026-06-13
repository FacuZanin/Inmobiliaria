// backend\src\modules\listings\domain\aggregates\listing.aggregate.ts

import { ValidationError } from '@/core/shared-kernel/errors';
import { ConflictError } from '@/core/shared-kernel/errors';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { PropertyType } from '@modules/listings/domain/enums/property-type.enum';
import { OperationType } from '@modules/listings/domain/enums/operation-type.enum';
import { ListingCategory } from '@modules/listings/domain/enums/listing-category.enum';
import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';
import { MediaProcessingStatus } from '@modules/listings/domain/enums/media-processing-status.enum';

import type { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

import { ListingPricingVO } from '@modules/listings/domain/value-objects/listing-pricing.vo';
import { ListingLocationVO } from '@modules/listings/domain/value-objects/listing-location.vo';
import { ListingFeaturesVO } from '@modules/listings/domain/value-objects/listing-features.vo';
import { ListingAddressVO } from '../value-objects/listing-address.vo';
import { ListingCoordinatesVO } from '../value-objects/listing-coordinates.vo';
import { ListingLocationProps } from '../value-objects/listing-location.vo';

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

  pricing?:
    | ListingPricingVO
    | {
        salePrice?: number | null;
        rentalPrice?: number | null;
        expenses?: number | null;
      };

  location?:
    | ListingLocationVO
    | {
        address?: string | null;
        city?: string | null;
        latitude?: number | null;
        longitude?: number | null;
      };

  features?:
    | ListingFeaturesVO
    | {
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

  private _pricing: ListingPricingVO;

  private _location: ListingLocationVO;

  private _features: ListingFeaturesVO;

  private _details: Record<string, any>;

  private _media: ListingMediaEntity[];

  private _analytics: {
    viewsCount: number;
    contactsCount: number;
    favoritesCount: number;
  };

  private _createdAt?: Date;

  private _updatedAt?: Date;

  private validateInvariants() {
    if (!this._title?.trim()) {
      throw new ValidationError('Listing title is required');
    }

    if (!this._ownerId) {
      throw new ValidationError('Listing owner is required');
    }
  }

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
      props.pricing instanceof ListingPricingVO
        ? props.pricing
        : new ListingPricingVO(props.pricing ?? {});

    this._location =
      props.location instanceof ListingLocationVO
        ? props.location
        : new ListingLocationVO({
            address:
              props.location?.address && props.location?.city
                ? new ListingAddressVO({
                    street: props.location.address,
                    city: props.location.city,
                  })
                : null,

            coordinates:
              props.location?.latitude != null &&
              props.location?.longitude != null
                ? new ListingCoordinatesVO(
                    props.location.latitude,
                    props.location.longitude,
                  )
                : null,
          });

    this._features =
      props.features instanceof ListingFeaturesVO
        ? props.features
        : new ListingFeaturesVO(props.features ?? {});

    this._details = props.details ?? {};

    this._media = props.media ?? [];

    this._analytics = props.analytics ?? {
      viewsCount: 0,
      contactsCount: 0,
      favoritesCount: 0,
    };

    this._createdAt = props.createdAt;

    this._updatedAt = props.updatedAt;

    this.validateInvariants();
  }

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
    return { ...this._details };
  }

  get media() {
    return [...this._media];
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
    return { ...this._analytics };
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  incrementViews() {
    this._analytics.viewsCount += 1;

    this.touch();
  }

  incrementContacts() {
    this._analytics.contactsCount += 1;

    this.touch();
  }

  syncFavorites(count: number) {
    this._analytics.favoritesCount = count;

    this.touch();
  }

  setSlug(slug: string) {
    this._slug = slug;

    this.touch();
  }

  makePrivate() {
    this._visibility = ListingVisibility.PRIVATE;

    this.touch();
  }

  makePublic() {
    this._visibility = ListingVisibility.PUBLIC;

    this.touch();
  }

  removeMedia(mediaId: number) {
    const mediaToRemove = this._media.find((media) => media.id === mediaId);

    if (!mediaToRemove) {
      return;
    }

    this._media = this._media.filter((media) => media.id !== mediaId);

    const hasPrimary = this._media.some((media) => media.isPrimary);

    if (!hasPrimary && this._media.length > 0) {
      this._media[0].markAsPrimary();
    }

    this.normalizeMediaOrder();

    this.touch();
  }

  publish() {
    if (this._moderationStatus !== ModerationStatus.APPROVED) {
      throw new ConflictError('Listing must be approved before publishing');
    }

    this.ensurePublishable();

    this._status = ListingStatus.ACTIVE;

    this.touch();
  }

  pause() {
    if (this._status !== ListingStatus.ACTIVE) {
      throw new ConflictError('Only active listings can be paused');
    }

    this._status = ListingStatus.PAUSED;

    this.touch();
  }

  reactivate() {
    if (this._status !== ListingStatus.PAUSED) {
      throw new ConflictError('Only paused listings can be reactivated');
    }

    this._status = ListingStatus.ACTIVE;

    this.touch();
  }

  archive() {
    if (this._status === ListingStatus.ARCHIVED) {
      throw new ConflictError('Listing already archived');
    }

    this._status = ListingStatus.ARCHIVED;

    this.touch();
  }

  approveModeration() {
    this._moderationStatus = ModerationStatus.APPROVED;

    this._moderationReason = null;

    this.touch();
  }

  rejectModeration(reason: string) {
    this._moderationStatus = ModerationStatus.REJECTED;

    this._moderationReason = reason;

    this.touch();
  }

  observeModeration(reason: string) {
    this._moderationStatus = ModerationStatus.OBSERVED;

    this._moderationReason = reason;

    this.touch();
  }

  suspendModeration(reason: string) {
    this._moderationStatus = ModerationStatus.SUSPENDED;

    this._moderationReason = reason;

    this.touch();
  }

  markAsUnderReview() {
    this._moderationStatus = ModerationStatus.PENDING_REVIEW;

    this.touch();
  }

  updateBasicInfo(data: { title?: string; description?: string | null }) {
    if (data.title !== undefined) {
      this._title = data.title;
    }

    if (data.description !== undefined) {
      this._description = data.description;
    }

    this.touch();
  }

  updatePricing(pricing: {
    salePrice?: number | null;
    rentalPrice?: number | null;
    expenses?: number | null;
  }) {
    this._pricing = new ListingPricingVO({
      ...this._pricing.toPrimitives(),
      ...pricing,
    });

    this.touch();
  }

  updateLocation(location: Partial<ListingLocationProps>) {
    this._location = new ListingLocationVO({
      address: location.address ?? this._location.address,

      coordinates: location.coordinates ?? this._location.coordinates,
    });

    this.touch();
  }

  updateFeatures(features: {
    rooms?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    coveredArea?: number | null;
    totalArea?: number | null;
  }) {
    this._features = new ListingFeaturesVO({
      ...this._features.toPrimitives(),
      ...features,
    });

    this.touch();
  }

  updateDetails(details: Record<string, any>) {
    this._details = {
      ...this._details,
      ...details,
    };

    this.touch();
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

      if (this._media.length >= 50) {
        throw new ConflictError('Listing media limit exceeded');
      }

      this._media.push(item);
    }

    this.normalizeMediaOrder();

    this.touch();
  }

  assignPersistenceId(id: number) {
    if (this._id !== null) {
      throw new ConflictError('Listing already has a persistence id');
    }

    this._id = id;
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

  private touch() {
    this._updatedAt = new Date();
  }

  private ensurePublishable() {
    if (this._title.trim().length < 10) {
      throw new ValidationError('Listing title is too short');
    }

    if (!this._description || this._description.length < 30) {
      throw new ValidationError('Listing description is too short');
    }

    if (!this._pricing.hasValidPrice()) {
      throw new ValidationError('Listing requires pricing before publishing');
    }

    if (!this._location.hasValidAddress()) {
      throw new ValidationError('Listing requires location before publishing');
    }

    const readyMedia = this._media.filter(
      (media) => media.processingStatus === MediaProcessingStatus.READY,
    );

    if (!readyMedia.length) {
      throw new ValidationError(
        'Listing requires processed media before publishing',
      );
    }

    const hasPrimary = readyMedia.some((media) => media.isPrimary);

    if (!hasPrimary) {
      throw new ValidationError('Listing requires a primary image');
    }
  }

  toPrimitives() {
    return {
      id: this._id,

      title: this._title,

      description: this._description,

      category: this._category,

      propertyType: this._propertyType,

      operationType: this._operationType,

      ownerId: this._ownerId,

      agencyId: this._agencyId,

      status: this._status,

      moderationStatus: this._moderationStatus,

      moderationReason: this._moderationReason,

      visibility: this._visibility,

      slug: this._slug,

      pricing: this._pricing.toPrimitives(),

      location: this._location.toPrimitives(),

      features: this._features.toPrimitives(),

      details: this._details,

      analytics: this._analytics,

      createdAt: this._createdAt,

      updatedAt: this._updatedAt,
    };
  }
}
