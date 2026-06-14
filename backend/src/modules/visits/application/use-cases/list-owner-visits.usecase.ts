import { Inject, Injectable } from '@nestjs/common';
import { VisitRepositoryPort } from '@/modules/visits/domain/repositories/visit.repository.port';
import { VISIT_REPOSITORY } from '../tokens';

@Injectable()
export class ListOwnerVisitsUseCase {
  constructor(
    @Inject(VISIT_REPOSITORY)
    private readonly repository: VisitRepositoryPort,
  ) {}

  execute(ownerId: number, agencyId?: number | null) {
    return this.repository.findByOwner(ownerId, agencyId);
  }
}
