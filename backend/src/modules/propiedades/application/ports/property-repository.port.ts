// backend\src\modules\propiedades\application\ports\property-repository.port.ts
import type { PropertyAggregate } from '../../domain/entities/property.aggregate';

export interface PropertyRepositoryPort {
  save(property: PropertyAggregate): Promise<PropertyAggregate>;
  findById(id: number): Promise<PropertyAggregate | null>;

  findAll(
    filters?: any,
    opts?: { limit?: number; offset?: number },
  ): Promise<{ items: PropertyAggregate[]; total: number }>;

  update(id: number, partial: any): Promise<PropertyAggregate | null>;
  delete(id: number): Promise<void>;
}
