// backend/src/modules/listings/domain/enums/moderation-status.enum.ts

export enum ModerationStatus {
  DRAFT = 'DRAFT',

  PENDING_REVIEW = 'PENDING_REVIEW',

  UNDER_REVIEW = 'UNDER_REVIEW',

  APPROVED = 'APPROVED',

  OBSERVED = 'OBSERVED',

  REJECTED = 'REJECTED',

  AUTO_REJECTED = 'AUTO_REJECTED',

  SUSPENDED = 'SUSPENDED',

  SHADOW_BANNED = 'SHADOW_BANNED',
}