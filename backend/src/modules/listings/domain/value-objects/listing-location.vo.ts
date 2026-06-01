// backend/src/modules/listings/domain/value-objects/listing-location.vo.ts

import { ListingAddressVO } from './listing-address.vo';

import { ListingCoordinatesVO } from './listing-coordinates.vo';


export type ListingLocationProps = {
  address?: ListingAddressVO | null;

  coordinates?: ListingCoordinatesVO | null;
};

export class ListingLocationVO {
  readonly address: ListingAddressVO | null;

  readonly coordinates: ListingCoordinatesVO | null;

  constructor(props: ListingLocationProps) {
    this.address =
      props.address ?? null;

    this.coordinates =
      props.coordinates ?? null;
  }

  public hasValidAddress(): boolean {
    return !!this.address;
  }

  public toPrimitives() {
    return {
      address:
        this.address?.street ?? null,

      city:
        this.address?.city ?? null,

      province:
        this.address?.province ?? null,

      country:
        this.address?.country ?? null,

      zipCode:
        this.address?.zipCode ?? null,

      latitude:
        this.coordinates?.latitude ?? null,

      longitude:
        this.coordinates?.longitude ?? null,
    };
  }
}