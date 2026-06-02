// backend\src\modules\listings\domain\entities\listing-media.entity.ts

import { DomainException } from '@/shared/domain/exceptions/domain.exception';

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

  sortOrder?: number;

  isPrimary?: boolean;

  processingStatus?: MediaProcessingStatus;

  metadata?: MediaMetadataVO | null;

  createdAt?: Date;

  thumbnailUrl?: string | null;

  filename?: string | null;

  processingError?: string | null;
};

export class ListingMediaEntity {
  private _id: number | null;

  private _listingId: number | null;

  private _type: ListingMediaType;

  private _url: string;

  private _storageKey: string;

  private _mimeType: string;

  private _sizeInBytes: number | null;

  private _sortOrder: number;

  private _isPrimary: boolean;

  private _processingStatus: MediaProcessingStatus;

  private _metadata: MediaMetadataVO | null;

  private _createdAt?: Date;

  private _thumbnailUrl: string | null;

  private _filename: string | null;

  private _processingError: string | null;

  private constructor(props: ListingMediaProps) {
    this.validate(props);

    this._id = props.id ?? null;

    this._listingId = props.listingId ?? null;

    this._type = props.type;

    this._url = props.url;

    this._storageKey = props.storageKey;

    this._mimeType = props.mimeType;

    this._sizeInBytes = props.sizeInBytes ?? null;

    this._sortOrder = props.sortOrder ?? 0;

    this._isPrimary = props.isPrimary ?? false;

    this._processingStatus =
      props.processingStatus ?? MediaProcessingStatus.PENDING;

    this._metadata = props.metadata ?? null;

    this._createdAt = props.createdAt;

    this._thumbnailUrl = props.thumbnailUrl ?? null;

    this._filename = props.filename ?? null;

    this._processingError = props.processingError ?? null;
  }

  static create(
    props: Omit<
      ListingMediaProps,
      'id' | 'listingId' | 'processingStatus' | 'createdAt'
    >,
  ) {
    return new ListingMediaEntity({
      ...props,
      processingStatus: MediaProcessingStatus.PENDING,
    });
  }

  static rehydrate(props: ListingMediaProps) {
    return new ListingMediaEntity(props);
  }

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

  get sortOrder() {
    return this._sortOrder;
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

  get thumbnailUrl() {
    return this._thumbnailUrl;
  }

  get filename() {
    return this._filename;
  }

  get processingError() {
    return this._processingError;
  }

  markAsPrimary() {
    this._isPrimary = true;
  }

  removeAsPrimary() {
    this._isPrimary = false;
  }

  markAsProcessing() {
    this._processingStatus = MediaProcessingStatus.PROCESSING;
  }

  markAsReady() {
    this._processingStatus = MediaProcessingStatus.READY;
  }

  markAsFailed(error?: string) {
    this._processingStatus = MediaProcessingStatus.FAILED;

    this._processingError = error ?? null;
  }

  reject() {
    this._processingStatus = MediaProcessingStatus.REJECTED;
  }

  updateSortOrder(SortOrder: number) {
    if (SortOrder < 0) {
      throw new DomainException('Invalid media order');
    }

    this._sortOrder = SortOrder;
  }

  setListingId(listingId: number) {
    if (!this._listingId) {
      this._listingId = listingId;
    }
  }

  private validate(props: ListingMediaProps) {
    if (!props.url?.trim()) {
      throw new DomainException('Media URL is required');
    }

    if (!props.storageKey?.trim()) {
      throw new DomainException('Media storageKey is required');
    }

    if (!props.mimeType?.trim()) {
      throw new DomainException('Media mimeType is required');
    }

    if (props.sizeInBytes != null && props.sizeInBytes < 0) {
      throw new DomainException('Invalid media size');
    }
  }
}
