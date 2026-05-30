// backend\src\modules\listings\domain\entities\listing-media.entity.ts

import { BadRequestException } from '@nestjs/common';

import { ListingMediaType } from '../enums/listing-media-type.enum';

import { MediaProcessingStatus } from '../enums/media-processing-status.enum';

import { MediaMetadataVO } from '../value-objects/media-metadata.vo';

type ListingMediaProps = {
  id?: number | null;

  listingId?: number | null;

  type: ListingMediaType;

  url: string;

  storageKey: string;

  mimeType: string;

  sizeInBytes?: number | null;

  order?: number;

  isPrimary?: boolean;

  processingStatus?: MediaProcessingStatus;

  metadata?: MediaMetadataVO | null;

  createdAt?: Date;
};

export class ListingMediaEntity {
  private _id: number | null;

  private _listingId: number | null;

  private _type: ListingMediaType;

  private _url: string;

  private _storageKey: string;

  private _mimeType: string;

  private _sizeInBytes: number | null;

  private _order: number;

  private _isPrimary: boolean;

  private _processingStatus: MediaProcessingStatus;

  private _metadata: MediaMetadataVO | null;

  private _createdAt?: Date;

  private constructor(props: ListingMediaProps) {
    this.validate(props);

    this._id = props.id ?? null;

    this._listingId = props.listingId ?? null;

    this._type = props.type;

    this._url = props.url;

    this._storageKey = props.storageKey;

    this._mimeType = props.mimeType;

    this._sizeInBytes =
      props.sizeInBytes ?? null;

    this._order = props.order ?? 0;

    this._isPrimary =
      props.isPrimary ?? false;

    this._processingStatus =
      props.processingStatus ??
      MediaProcessingStatus.PENDING;

    this._metadata =
      props.metadata ?? null;

    this._createdAt = props.createdAt;
  }

  // =====================================================
  // FACTORIES
  // =====================================================

  static create(
    props: Omit<
      ListingMediaProps,
      | 'id'
      | 'listingId'
      | 'processingStatus'
      | 'createdAt'
    >,
  ) {
    return new ListingMediaEntity({
      ...props,
      processingStatus:
        MediaProcessingStatus.PENDING,
    });
  }

  static rehydrate(
    props: ListingMediaProps,
  ) {
    return new ListingMediaEntity(props);
  }

  // =====================================================
  // GETTERS
  // =====================================================

  get id() {
    return this._id;
  }

  get listingId() {
    return this._listingId;
  }

  get type() {
    return this._type;
  }

  get url() {
    return this._url;
  }

  get storageKey() {
    return this._storageKey;
  }

  get mimeType() {
    return this._mimeType;
  }

  get sizeInBytes() {
    return this._sizeInBytes;
  }

  get order() {
    return this._order;
  }

  get isPrimary() {
    return this._isPrimary;
  }

  get processingStatus() {
    return this._processingStatus;
  }

  get metadata() {
    return this._metadata;
  }

  get createdAt() {
    return this._createdAt;
  }

  // =====================================================
  // DOMAIN RULES
  // =====================================================

  markAsPrimary() {
    this._isPrimary = true;
  }

  removeAsPrimary() {
    this._isPrimary = false;
  }

  markAsProcessing() {
    this._processingStatus =
      MediaProcessingStatus.PROCESSING;
  }

  markAsReady() {
    this._processingStatus =
      MediaProcessingStatus.READY;
  }

  markAsFailed() {
    this._processingStatus =
      MediaProcessingStatus.FAILED;
  }

  reject() {
    this._processingStatus =
      MediaProcessingStatus.REJECTED;
  }

  updateOrder(order: number) {
    if (order < 0) {
      throw new BadRequestException(
        'Invalid media order',
      );
    }

    this._order = order;
  }

  setListingId(listingId: number) {
    if (!this._listingId) {
      this._listingId = listingId;
    }
  }

  // =====================================================
  // VALIDATIONS
  // =====================================================

  private validate(
    props: ListingMediaProps,
  ) {
    if (!props.url?.trim()) {
      throw new BadRequestException(
        'Media URL is required',
      );
    }

    if (!props.storageKey?.trim()) {
      throw new BadRequestException(
        'Media storageKey is required',
      );
    }

    if (!props.mimeType?.trim()) {
      throw new BadRequestException(
        'Media mimeType is required',
      );
    }

    if (
      props.sizeInBytes != null &&
      props.sizeInBytes < 0
    ) {
      throw new BadRequestException(
        'Invalid media size',
      );
    }
  }
}