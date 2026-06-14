import { PropertyAggregate } from '../../domain/aggregates/property.aggregate';
import { PropertyAddressVO } from '../../domain/value-objects/property-address.vo';
import { PropertyCoordinatesVO } from '../../domain/value-objects/property-coordinates.vo';
import { PropertyFeaturesVO } from '../../domain/value-objects/property-features.vo';
import { PropertyPricingVO } from '../../domain/value-objects/property-pricing.vo';
import { PropertyOrmEntity } from '../persistence/typeorm/entities/property.orm-entity';

export class PropertyMapper {
  static toDomain(entity: PropertyOrmEntity): PropertyAggregate {
    return PropertyAggregate.rehydrate({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      operationType: entity.operationType,
      status: entity.status,
      visibility: entity.visibility,
      ownerId: entity.ownerId,
      agencyId: entity.agencyId,
      address: new PropertyAddressVO({
        street: entity.street,
        city: entity.city,
        province: entity.province,
        country: entity.country,
        postalCode: entity.postalCode,
      }),
      coordinates:
        entity.latitude != null && entity.longitude != null
          ? new PropertyCoordinatesVO(entity.latitude, entity.longitude)
          : null,
      pricing: new PropertyPricingVO({
        salePrice: entity.salePrice,
        rentalPrice: entity.rentalPrice,
        expenses: entity.expenses,
        currency: entity.currency,
      }),
      features: new PropertyFeaturesVO({
        rooms: entity.rooms,
        bedrooms: entity.bedrooms,
        bathrooms: entity.bathrooms,
        coveredArea: entity.coveredArea,
        totalArea: entity.totalArea,
        parkingSpaces: entity.parkingSpaces,
        age: entity.age,
      }),
      amenities: entity.amenities ?? [],
      details: entity.details ?? {},
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(aggregate: PropertyAggregate): Partial<PropertyOrmEntity> {
    const primitives = aggregate.toPrimitives();
    const entity = new PropertyOrmEntity();

    entity.id = primitives.id ?? undefined!;
    entity.title = primitives.title;
    entity.description = primitives.description;
    entity.type = primitives.type;
    entity.operationType = primitives.operationType;
    entity.status = primitives.status;
    entity.visibility = primitives.visibility;
    entity.ownerId = primitives.ownerId;
    entity.agencyId = primitives.agencyId;
    entity.street = primitives.address.street;
    entity.city = primitives.address.city;
    entity.province = primitives.address.province ?? null;
    entity.country = primitives.address.country ?? null;
    entity.postalCode = primitives.address.postalCode ?? null;
    entity.latitude = primitives.coordinates?.latitude ?? null;
    entity.longitude = primitives.coordinates?.longitude ?? null;
    entity.salePrice = primitives.pricing.salePrice;
    entity.rentalPrice = primitives.pricing.rentalPrice;
    entity.expenses = primitives.pricing.expenses;
    entity.currency = primitives.pricing.currency;
    entity.rooms = primitives.features.rooms ?? null;
    entity.bedrooms = primitives.features.bedrooms ?? null;
    entity.bathrooms = primitives.features.bathrooms ?? null;
    entity.coveredArea = primitives.features.coveredArea ?? null;
    entity.totalArea = primitives.features.totalArea ?? null;
    entity.parkingSpaces = primitives.features.parkingSpaces ?? null;
    entity.age = primitives.features.age ?? null;
    entity.amenities = primitives.amenities;
    entity.details = primitives.details;

    return entity;
  }
}
