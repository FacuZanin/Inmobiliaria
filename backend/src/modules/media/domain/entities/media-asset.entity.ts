import { BadRequestException } from '@nestjs/common';
import { MediaAssetType } from '../enums/media-asset-type.enum';
import { MediaOwnerType } from '../enums/media-owner-type.enum';
import { MediaProcessingStatus } from '../enums/media-processing-status.enum';

export type MediaAssetProps = {
  id?: number | null;
  ownerType: MediaOwnerType;
  ownerId: number;
  type: MediaAssetType;
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  sizeInBytes: number;
  uploadedById: number;
  collection?: string | null;
  status?: MediaProcessingStatus;
  processingError?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class MediaAssetEntity {
  private readonly props: Required<
    Omit<MediaAssetProps, 'id' | 'createdAt' | 'updatedAt'>
  > & {
    id: number | null;
    createdAt?: Date;
    updatedAt?: Date;
  };

  private constructor(props: MediaAssetProps) {
    this.ensureValid(props);

    this.props = {
      id: props.id ?? null,
      ownerType: props.ownerType,
      ownerId: props.ownerId,
      type: props.type,
      url: props.url,
      storageKey: props.storageKey,
      originalName: props.originalName,
      mimeType: props.mimeType,
      sizeInBytes: props.sizeInBytes,
      uploadedById: props.uploadedById,
      collection: props.collection ?? null,
      status: props.status ?? MediaProcessingStatus.PENDING,
      processingError: props.processingError ?? null,
      metadata: props.metadata ?? null,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  static create(props: Omit<MediaAssetProps, 'id' | 'status'>) {
    return new MediaAssetEntity({
      ...props,
      status: MediaProcessingStatus.PENDING,
    });
  }

  static rehydrate(props: MediaAssetProps) {
    return new MediaAssetEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get ownerType() {
    return this.props.ownerType;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get type() {
    return this.props.type;
  }

  get url() {
    return this.props.url;
  }

  get storageKey() {
    return this.props.storageKey;
  }

  get originalName() {
    return this.props.originalName;
  }

  get mimeType() {
    return this.props.mimeType;
  }

  get sizeInBytes() {
    return this.props.sizeInBytes;
  }

  get uploadedById() {
    return this.props.uploadedById;
  }

  get collection() {
    return this.props.collection;
  }

  get status() {
    return this.props.status;
  }

  get processingError() {
    return this.props.processingError;
  }

  get metadata() {
    return this.props.metadata;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  markProcessing() {
    this.props.status = MediaProcessingStatus.PROCESSING;
    this.props.processingError = null;
  }

  markReady(metadata?: Record<string, unknown>) {
    this.props.status = MediaProcessingStatus.READY;
    this.props.processingError = null;
    this.props.metadata = metadata ?? this.props.metadata;
  }

  markFailed(error: string) {
    this.props.status = MediaProcessingStatus.FAILED;
    this.props.processingError = error;
  }

  markDeleted() {
    this.props.status = MediaProcessingStatus.DELETED;
  }

  private ensureValid(props: MediaAssetProps) {
    if (!props.ownerId || props.ownerId < 1) {
      throw new BadRequestException('Media owner is required');
    }

    if (!props.uploadedById || props.uploadedById < 1) {
      throw new BadRequestException('Media uploader is required');
    }

    if (!props.url?.trim()) {
      throw new BadRequestException('Media URL is required');
    }

    if (!props.storageKey?.trim()) {
      throw new BadRequestException('Media storage key is required');
    }

    if (!props.mimeType?.trim()) {
      throw new BadRequestException('Media mime type is required');
    }

    if (!props.sizeInBytes || props.sizeInBytes < 1) {
      throw new BadRequestException('Media file is empty');
    }
  }
}
