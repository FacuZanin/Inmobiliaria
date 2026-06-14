import { ValidationError } from '@/core/shared-kernel/errors';

export type PropertyFeaturesProps = {
  rooms?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  coveredArea?: number | null;
  totalArea?: number | null;
  parkingSpaces?: number | null;
  age?: number | null;
};

export class PropertyFeaturesVO {
  constructor(private readonly props: PropertyFeaturesProps = {}) {
    for (const [field, value] of Object.entries(props)) {
      if (value != null && value < 0) {
        throw new ValidationError(`Property feature ${field} cannot be negative`);
      }
    }
  }

  get rooms(): number | null {
    return this.props.rooms ?? null;
  }

  get bedrooms(): number | null {
    return this.props.bedrooms ?? null;
  }

  get bathrooms(): number | null {
    return this.props.bathrooms ?? null;
  }

  get coveredArea(): number | null {
    return this.props.coveredArea ?? null;
  }

  get totalArea(): number | null {
    return this.props.totalArea ?? null;
  }

  get parkingSpaces(): number | null {
    return this.props.parkingSpaces ?? null;
  }

  get age(): number | null {
    return this.props.age ?? null;
  }

  toPrimitives(): PropertyFeaturesProps {
    return {
      rooms: this.rooms,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      coveredArea: this.coveredArea,
      totalArea: this.totalArea,
      parkingSpaces: this.parkingSpaces,
      age: this.age,
    };
  }
}
