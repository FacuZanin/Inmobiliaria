// backend/src/modules/listings/domain/value-objects/listing-price.vo.ts

import { BadRequestException } from '@nestjs/common';

export class ListingPriceVO {
  readonly value: number;

  constructor(value: number) {
    if (
      value == null ||
      Number.isNaN(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        'Invalid listing price',
      );
    }

    this.value = value;
  }
}
