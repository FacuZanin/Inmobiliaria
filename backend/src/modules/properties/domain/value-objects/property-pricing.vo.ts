import { ValidationError } from '@/core/shared-kernel/errors';

export type PropertyPricingProps = {
  salePrice?: number | null;
  rentalPrice?: number | null;
  expenses?: number | null;
  currency?: string | null;
};

export class PropertyPricingVO {
  constructor(private readonly props: PropertyPricingProps = {}) {
    for (const [field, value] of Object.entries(props)) {
      if (typeof value === 'number' && value < 0) {
        throw new ValidationError(`Property price ${field} cannot be negative`);
      }
    }
  }

  get salePrice(): number | null {
    return this.props.salePrice ?? null;
  }

  get rentalPrice(): number | null {
    return this.props.rentalPrice ?? null;
  }

  get expenses(): number | null {
    return this.props.expenses ?? null;
  }

  get currency(): string {
    return this.props.currency ?? 'ARS';
  }

  toPrimitives(): {
    salePrice: number | null;
    rentalPrice: number | null;
    expenses: number | null;
    currency: string;
  } {
    return {
      salePrice: this.salePrice,
      rentalPrice: this.rentalPrice,
      expenses: this.expenses,
      currency: this.currency,
    };
  }
}
