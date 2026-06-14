import { PropertyAggregate } from '../aggregates/property.aggregate';

export abstract class PropertyRepositoryPort {
  abstract save(property: PropertyAggregate): Promise<PropertyAggregate>;

  abstract update(
    id: number,
    property: PropertyAggregate,
  ): Promise<PropertyAggregate>;

  abstract findById(id: number): Promise<PropertyAggregate | null>;

  abstract delete(id: number): Promise<void>;
}
