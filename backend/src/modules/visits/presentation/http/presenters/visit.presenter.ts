import { VisitEntity } from '@/modules/visits/domain/entities/visit.entity';

export class VisitPresenter {
  static toHttp(visit: VisitEntity) {
    return {
      id: visit.id,
      listingId: visit.listingId,
      propertyId: visit.propertyId,
      requesterId: visit.requesterId,
      ownerId: visit.ownerId,
      agencyId: visit.agencyId,
      desiredAt: visit.desiredAt,
      scheduledAt: visit.scheduledAt,
      message: visit.message,
      status: visit.status,
      rejectionReason: visit.rejectionReason,
      cancellationReason: visit.cancellationReason,
      cancelledById: visit.cancelledById,
      createdAt: visit.createdAt,
      updatedAt: visit.updatedAt,
    };
  }

  static collection(visits: VisitEntity[]) {
    return visits.map((visit) => this.toHttp(visit));
  }
}
