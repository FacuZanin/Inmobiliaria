// backend\src\modules\propiedades\application\ports\property-repository.port.ts
import type { PropertyAggregate } from '../../domain/entities/property.aggregate';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

import { AdminPropertiesQueryDto } from '../dto/admin-properties-query.dto';

export interface PropertyRepositoryPort {
  save(property: PropertyAggregate): Promise<PropertyAggregate>;

  findById(id: number): Promise<PropertyAggregate | null>;

  findAll(
    filters?: any,
    query?: AdminPropertiesQueryDto
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }>;

  update(
    id: number,
    property: PropertyAggregate,
  ): Promise<PropertyAggregate | null>;

  softDelete(id: number): Promise<void>;

  countByUser(userId: number): Promise<number>;

  // =================================================
  // MODERATION
  // =================================================

  findPendingModeration(
    query?: AdminPropertiesQueryDto
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }>;

  findByModerationStatus(
    moderationStatus: PublicacionStatus,
    query?: AdminPropertiesQueryDto
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }>;
}