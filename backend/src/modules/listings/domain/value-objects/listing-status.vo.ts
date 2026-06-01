// backend/src/modules/listings/domain/value-objects/listing-status.vo.ts

import { ListingStatus as ListingStatusEnum } from '../enums/listing-status.enum';

export class ListingStatusVO {
  private readonly value: ListingStatusEnum;

  constructor(value: ListingStatusEnum) {
    this.validate(value);

    this.value = value;
  }

  private validate(value: ListingStatusEnum): void {
    if (!Object.values(ListingStatusEnum).includes(value)) {
      throw new Error(`Invalid listing status: ${value}`);
    }
  }

  public getValue(): ListingStatusEnum {
    return this.value;
  }

  public isActive(): boolean {
    return this.value === ListingStatusEnum.ACTIVE;
  }

  public isDraft(): boolean {
    return this.value === ListingStatusEnum.DRAFT;
  }

  public isArchived(): boolean {
    return this.value === ListingStatusEnum.ARCHIVED;
  }

  public isPaused(): boolean {
    return this.value === ListingStatusEnum.PAUSED;
  }

  public isSold(): boolean {
    return this.value === ListingStatusEnum.SOLD;
  }

  public isRented(): boolean {
    return this.value === ListingStatusEnum.RENTED;
  }

  public isReserved(): boolean {
    return this.value === ListingStatusEnum.RESERVED;
  }

  public toString(): string {
    return this.value;
  }
}