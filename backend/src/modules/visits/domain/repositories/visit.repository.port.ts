import { VisitEntity } from '../entities/visit.entity';

export abstract class VisitRepositoryPort {
  abstract save(visit: VisitEntity): Promise<VisitEntity>;
  abstract findById(id: number): Promise<VisitEntity | null>;
  abstract findByRequester(requesterId: number): Promise<VisitEntity[]>;
  abstract findByOwner(ownerId: number, agencyId?: number | null): Promise<VisitEntity[]>;
}
