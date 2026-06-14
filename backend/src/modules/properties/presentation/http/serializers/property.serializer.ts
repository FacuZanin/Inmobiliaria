import { PaginatedPropertiesResult } from '@/modules/properties/domain/repositories/property-query.repository.port';
import { PropertyAggregate } from '@/modules/properties/domain/aggregates/property.aggregate';

export class PropertySerializer {
  static serialize(property: PropertyAggregate) {
    return property.toPrimitives();
  }

  static serializePaginated(result: PaginatedPropertiesResult) {
    return {
      data: result.items.map((item) => this.serialize(item)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPrevPage: result.page > 1,
      },
    };
  }
}
