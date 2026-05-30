// backend/src/modules/listings/domain/enums/media-processing-status.enum.ts

export enum MediaProcessingStatus {
  PENDING = 'PENDING',

  PROCESSING = 'PROCESSING',

  READY = 'READY',

  FAILED = 'FAILED',

  REJECTED = 'REJECTED',
}