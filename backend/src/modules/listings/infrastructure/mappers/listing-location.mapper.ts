// backend\src\modules\listings\infrastructure\mappers\listing-location.mapper.ts
import { ListingLocationVO } from '@modules/listings/domain/value-objects/listing-location.vo';
import { ListingAddressVO } from '@modules/listings/domain/value-objects/listing-address.vo';
import { ListingCoordinatesVO } from '@modules/listings/domain/value-objects/listing-coordinates.vo';

import { ListingOrmEntity } from '../persistence/entities/listing.orm-entity';

export class ListingLocationMapper {
  static toDomain(
    entity: ListingOrmEntity,
  ): ListingLocationVO {
    return new ListingLocationVO({
      address:
        entity.address && entity.city
          ? new ListingAddressVO({
              street: entity.address,
              city: entity.city,
            })
          : null,

      coordinates:
        entity.latitude != null &&
        entity.longitude != null
          ? new ListingCoordinatesVO(
              entity.latitude,
              entity.longitude,
            )
          : null,
    });
  }

  static toOrm(
    location: ListingLocationVO,
  ): Pick<
    ListingOrmEntity,
    'address' | 'city' | 'latitude' | 'longitude'
  > {
    return {
      address:
        location.address?.street ?? null,

      city:
        location.address?.city ?? null,

      latitude:
        location.coordinates?.latitude ??
        null,

      longitude:
        location.coordinates?.longitude ??
        null,
    };
  }
}