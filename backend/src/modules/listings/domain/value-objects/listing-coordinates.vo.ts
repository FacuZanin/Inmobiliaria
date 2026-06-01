// backend/src/modules/listings/domain/value-objects/listing-coordinates.vo.ts

import { BadRequestException } from '@nestjs/common';

export class ListingCoordinatesVO {
  readonly latitude: number;

  readonly longitude: number;

  constructor(
    latitude: number,
    longitude: number,
  ) {
    if (
      latitude < -90 ||
      latitude > 90
    ) {
      throw new BadRequestException(
        'Invalid latitude',
      );
    }

    if (
      longitude < -180 ||
      longitude > 180
    ) {
      throw new BadRequestException(
        'Invalid longitude',
      );
    }

    this.latitude = latitude;

    this.longitude = longitude;
  }
}