// backend\src\modules\propiedades\application\ports\property-search.port.ts

import type { PropertyAggregate } from '../../domain/entities/property.aggregate';

export interface PropertySearchPort {
  search(
    filters: Record<string, any>,
    pagination?: { limit?: number; offset?: number },
  ): Promise<{ items: PropertyAggregate[]; total: number }>;
}
