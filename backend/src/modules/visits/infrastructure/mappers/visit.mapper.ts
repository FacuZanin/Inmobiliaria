import { VisitEntity } from '@/modules/visits/domain/entities/visit.entity';
import { VisitOrmEntity } from '../persistence/typeorm/entities/visit.orm-entity';

export class VisitMapper {
  static toDomain(entity: VisitOrmEntity): VisitEntity {
    return VisitEntity.rehydrate({
      id: entity.id,
      listingId: entity.listingId,
      propertyId: entity.propertyId,
      requesterId: entity.requesterId,
      ownerId: entity.ownerId,
      agencyId: entity.agencyId,
      desiredAt: entity.desiredAt,
      scheduledAt: entity.scheduledAt,
      message: entity.message,
      status: entity.status,
      rejectionReason: entity.rejectionReason,
      cancellationReason: entity.cancellationReason,
      cancelledById: entity.cancelledById,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(visit: VisitEntity): VisitOrmEntity {
    const entity = new VisitOrmEntity();

    entity.id = visit.id ?? undefined!;
    entity.listingId = visit.listingId;
    entity.propertyId = visit.propertyId;
    entity.requesterId = visit.requesterId;
    entity.ownerId = visit.ownerId;
    entity.agencyId = visit.agencyId;
    entity.desiredAt = visit.desiredAt;
    entity.scheduledAt = visit.scheduledAt;
    entity.message = visit.message;
    entity.status = visit.status;
    entity.rejectionReason = visit.rejectionReason;
    entity.cancellationReason = visit.cancellationReason;
    entity.cancelledById = visit.cancelledById;

    return entity;
  }
}
