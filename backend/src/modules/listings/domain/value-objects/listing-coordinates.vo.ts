// backend/src/modules/listings/domain/value-objects/listing-coordinates.vo.ts

import { DomainException } from '@/shared/domain/exceptions/domain.exception';

export class ListingCoordinatesVO {
  readonly latitude: number;

  readonly longitude: number;

  constructor(
    latitude: number,
    longitude: number,
  ) {
    if (Number.isNaN(latitude)) {
      throw new DomainException(
        'Latitude must be a valid number',
      );
    }

    if (Number.isNaN(longitude)) {
      throw new DomainException(
        'Longitude must be a valid number',
      );
    }

    if (
      latitude < -90 ||
      latitude > 90
    ) {
      throw new DomainException(
        'Invalid latitude',
      );
    }

    if (
      longitude < -180 ||
      longitude > 180
    ) {
      throw new DomainException(
        'Invalid longitude',
      );
    }

    this.latitude = latitude;

    this.longitude = longitude;

    Object.freeze(this);
  }

  public toPrimitives() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}