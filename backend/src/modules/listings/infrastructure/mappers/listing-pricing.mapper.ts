// backend\src\modules\listings\infrastructure\mappers\listing-pricing.mapper.ts
import { ListingPricingVO } from '@modules/listings/domain/value-objects/listing-pricing.vo';

import { ListingOrmEntity } from '../persistence/entities/listing.orm-entity';

export class ListingPricingMapper {
  static toDomain(
    entity: ListingOrmEntity,
  ): ListingPricingVO {
    return new ListingPricingVO({
      salePrice: entity.salePrice,

      rentalPrice: entity.rentalPrice,

      expenses: entity.expenses,
    });
  }

  static toOrm(
    pricing: ListingPricingVO,
  ): Pick<
    ListingOrmEntity,
    'salePrice' | 'rentalPrice' | 'expenses'
  > {
    return {
      salePrice: pricing.salePrice ?? null,

      rentalPrice: pricing.rentalPrice ?? null,

      expenses: pricing.expenses ?? null,
    };
  }
}