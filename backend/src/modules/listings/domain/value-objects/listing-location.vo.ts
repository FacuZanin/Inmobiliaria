// backend/src/modules/listings/domain/value-objects/listing-location.vo.ts

import { AddressVO } from './address.vo';

import { CoordinatesVO } from './coordinates.vo';

type ListingLocationProps = {
  address?: AddressVO | null;

  city?: string | null;

  coordinates?: CoordinatesVO | null;
};

export class ListingLocationVO {
  readonly address: AddressVO | null;

  readonly city: string | null;

  readonly coordinates: CoordinatesVO | null;

  constructor(props: ListingLocationProps) {
    this.address =
      props.address ?? null;

    this.city =
      props.city?.trim() ?? null;

    this.coordinates =
      props.coordinates ?? null;
  }
}