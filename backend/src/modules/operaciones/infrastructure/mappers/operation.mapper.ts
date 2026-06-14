import { OperationEntity } from '@/modules/operaciones/domain/entities/operation.entity';
import { OperationHistoryEntity } from '@/modules/operaciones/domain/entities/operation-history.entity';
import { OperationHistoryOrmEntity } from '../persistence/typeorm/entities/operation-history.orm-entity';
import { OperationOrmEntity } from '../persistence/typeorm/entities/operation.orm-entity';

export class OperationMapper {
  static toDomain(entity: OperationOrmEntity): OperationEntity {
    return OperationEntity.rehydrate({
      id: entity.id,
      type: entity.type,
      status: entity.status,
      listingId: entity.listingId,
      propertyId: entity.propertyId,
      buyerId: entity.buyerId,
      ownerId: entity.ownerId,
      agencyId: entity.agencyId,
      amount: entity.amount,
      currency: entity.currency,
      message: entity.message,
      reservationDate: entity.reservationDate,
      finalizedAt: entity.finalizedAt,
      cancelledAt: entity.cancelledAt,
      cancellationReason: entity.cancellationReason,
      history:
        entity.history?.map((history) =>
          OperationHistoryEntity.rehydrate({
            id: history.id,
            operationId: history.operationId,
            fromStatus: history.fromStatus,
            toStatus: history.toStatus,
            changedById: history.changedById,
            note: history.note,
            createdAt: history.createdAt,
          }),
        ) ?? [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(operation: OperationEntity): OperationOrmEntity {
    const entity = new OperationOrmEntity();

    entity.id = operation.id ?? undefined!;
    entity.type = operation.type;
    entity.status = operation.status;
    entity.listingId = operation.listingId;
    entity.propertyId = operation.propertyId;
    entity.buyerId = operation.buyerId;
    entity.ownerId = operation.ownerId;
    entity.agencyId = operation.agencyId;
    entity.amount = operation.amount;
    entity.currency = operation.currency;
    entity.message = operation.message;
    entity.reservationDate = operation.reservationDate;
    entity.finalizedAt = operation.finalizedAt;
    entity.cancelledAt = operation.cancelledAt;
    entity.cancellationReason = operation.cancellationReason;
    entity.history = [];

    return entity;
  }

  static historyToOrm(
    history: OperationHistoryEntity,
    operationId: number,
  ): OperationHistoryOrmEntity {
    const entity = new OperationHistoryOrmEntity();

    entity.id = history.id ?? undefined!;
    entity.operationId = history.operationId ?? operationId;
    entity.fromStatus = history.fromStatus;
    entity.toStatus = history.toStatus;
    entity.changedById = history.changedById;
    entity.note = history.note;

    return entity;
  }
}
