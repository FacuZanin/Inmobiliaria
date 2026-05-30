// backend/src/modules/listings/domain/value-objects/location.vo.ts

import { BadRequestException } from '@nestjs/common';

type LocationVOProps = {
  address?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export class LocationVO {
  private readonly _address: string | null;

  private readonly _city: string | null;

  private readonly _latitude: number | null;

  private readonly _longitude: number | null;

  constructor(props: LocationVOProps) {
    if (
      props.latitude != null &&
      (props.latitude < -90 ||
        props.latitude > 90)
    ) {
      throw new BadRequestException(
        'Invalid latitude',
      );
    }

    if (
      props.longitude != null &&
      (props.longitude < -180 ||
        props.longitude > 180)
    ) {
      throw new BadRequestException(
        'Invalid longitude',
      );
    }

    this._address = props.address ?? null;

    this._city = props.city ?? null;

    this._latitude =
      props.latitude ?? null;

    this._longitude =
      props.longitude ?? null;
  }

  get address() {
    return this._address;
  }

  get city() {
    return this._city;
  }

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  hasValidAddress() {
    return !!this._address;
  }

  toPrimitives() {
    return {
      address: this._address,
      city: this._city,
      latitude: this._latitude,
      longitude: this._longitude,
    };
  }
}