// backend/src/modules/listings/domain/value-objects/listing-price.vo.ts

import { DomainException } from '@/core/shared/domain/exceptions/domain.exception';

export class ListingPriceVO {
  readonly value: number;

  constructor(value: number) {
    if (
      value == null ||
      Number.isNaN(value) ||
      value < 0
    ) {
      throw new DomainException(
        'Invalid listing price',
      );
    }

    this.value = value;
  }
}
