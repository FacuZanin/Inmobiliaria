import { ValidationError } from '@/core/shared-kernel/errors';

export type PropertyAddressProps = {
  street: string;
  city: string;
  province?: string | null;
  country?: string | null;
  postalCode?: string | null;
};

export class PropertyAddressVO {
  constructor(private readonly props: PropertyAddressProps) {
    if (!props.street?.trim()) {
      throw new ValidationError('Property street is required');
    }

    if (!props.city?.trim()) {
      throw new ValidationError('Property city is required');
    }
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get province(): string | null {
    return this.props.province ?? null;
  }

  get country(): string | null {
    return this.props.country ?? null;
  }

  get postalCode(): string | null {
    return this.props.postalCode ?? null;
  }

  toPrimitives(): PropertyAddressProps {
    return {
      street: this.street,
      city: this.city,
      province: this.province,
      country: this.country,
      postalCode: this.postalCode,
    };
  }
}
