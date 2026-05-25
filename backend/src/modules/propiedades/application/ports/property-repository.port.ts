// backend\src\modules\propiedades\application\ports\property-repository.port.ts
import type { PropertyAggregate } from '../../domain/entities/property.aggregate';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

export interface PropertyRepositoryPort {
  save(property: PropertyAggregate): Promise<PropertyAggregate>;

  findById(id: number): Promise<PropertyAggregate | null>;

  findAll(
    filters?: any,
    opts?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }>;

  update(id: number, partial: any): Promise<PropertyAggregate | null>;

  softDelete(id: number): Promise<void>;

  countByUser(userId: number): Promise<number>;

  // =================================================
  // MODERATION
  // =================================================

  findPendingModeration(opts?: { limit?: number; offset?: number }): Promise<{
    items: PropertyAggregate[];
    total: number;
  }>;

  findByModerationStatus(
    moderationStatus: PublicacionStatus,
    opts?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }>;
}
