// backend/src/modules/listings/domain/value-objects/listing-price.vo.ts

import { ValidationError } from '@/core/shared-kernel/errors';

export class ListingPriceVO {
  readonly value: number;

  constructor(value: number) {
    if (
      value == null ||
      Number.isNaN(value) ||
      value < 0
    ) {
      throw new ValidationError(
        'Invalid listing price',
      );
    }

    this.value = value;
  }
}
