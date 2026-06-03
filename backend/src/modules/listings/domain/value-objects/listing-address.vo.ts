// backend/src/modules/listings/domain/value-objects/listing-address.vo.ts

import { DomainException } from '@/core/shared/domain/exceptions/domain.exception';

export type ListingAddressProps = {
  street: string;

  city: string;

  province?: string | null;

  country?: string | null;

  zipCode?: string | null;
};

export class ListingAddressVO {
  readonly street: string;

  readonly city: string;

  readonly province: string | null;

  readonly country: string | null;

  readonly zipCode: string | null;

  constructor(props: ListingAddressProps) {
    if (!props.street?.trim()) {
      throw new DomainException(
        'Invalid street',
      );
    }

    if (!props.city?.trim()) {
      throw new DomainException(
        'Invalid city',
      );
    }

    this.street = props.street.trim();

    this.city = props.city.trim();

    this.province =
      props.province?.trim() ?? null;

    this.country =
      props.country?.trim() ?? null;

    this.zipCode =
      props.zipCode?.trim() ?? null;

    Object.freeze(this);
  }

  public getValue(): string {
    return [
      this.street,
      this.city,
      this.province,
      this.country,
    ]
      .filter(Boolean)
      .join(', ');
  }

  public toPrimitives() {
    return {
      street: this.street,
      city: this.city,
      province: this.province,
      country: this.country,
      zipCode: this.zipCode,
    };
  }

  public toString(): string {
    return this.getValue();
  }
}