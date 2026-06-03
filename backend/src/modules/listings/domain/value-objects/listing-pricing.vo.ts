// backend/src/modules/listings/domain/value-objects/listing-pricing.vo.ts

import { DomainException } from '@/core/shared/domain/exceptions/domain.exception';

type ListingPricingVOProps = {
  salePrice?: number | null;
  rentalPrice?: number | null;
  expenses?: number | null;
};

export class ListingPricingVO {
  private readonly _salePrice: number | null;

  private readonly _rentalPrice: number | null;

  private readonly _expenses: number | null;

  constructor(props: ListingPricingVOProps) {
    if (props.salePrice != null && props.salePrice < 0) {
      throw new DomainException('Sale price cannot be negative');
    }

    if (props.rentalPrice != null && props.rentalPrice < 0) {
      throw new DomainException('Rental price cannot be negative');
    }

    if (props.expenses != null && props.expenses < 0) {
      throw new DomainException('Expenses cannot be negative');
    }

    this._salePrice = props.salePrice ?? null;

    this._rentalPrice = props.rentalPrice ?? null;

    this._expenses = props.expenses ?? null;

    Object.freeze(this);
  }

  get salePrice() {
    return this._salePrice;
  }

  get rentalPrice() {
    return this._rentalPrice;
  }

  get expenses() {
    return this._expenses;
  }

  hasValidPrice() {
    return this._salePrice != null || this._rentalPrice != null;
  }

  toPrimitives() {
    return {
      salePrice: this._salePrice,
      rentalPrice: this._rentalPrice,
      expenses: this._expenses,
    };
  }
}
