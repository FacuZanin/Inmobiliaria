// backend/src/modules/listings/domain/value-objects/listing-pricing.vo.ts

import { ListingPriceVO } from './listing-price.vo';

type ListingPricingProps = {
  salePrice?: ListingPriceVO | null;

  rentalPrice?: ListingPriceVO | null;

  expenses?: ListingPriceVO | null;
};

export class ListingPricingVO {
  readonly salePrice: ListingPriceVO | null;

  readonly rentalPrice: ListingPriceVO | null;

  readonly expenses: ListingPriceVO | null;

  constructor(props: ListingPricingProps) {
    this.salePrice =
      props.salePrice ?? null;

    this.rentalPrice =
      props.rentalPrice ?? null;

    this.expenses =
      props.expenses ?? null;
  }
}