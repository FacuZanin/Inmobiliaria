// backend/src/modules/listings/domain/value-objects/address.vo.ts

import { BadRequestException } from '@nestjs/common';

export class AddressVO {
  readonly value: string;

  constructor(value: string) {
    if (!value?.trim()) {
      throw new BadRequestException(
        'Invalid address',
      );
    }

    this.value = value.trim();
  }

  toString() {
    return this.value;
  }
}