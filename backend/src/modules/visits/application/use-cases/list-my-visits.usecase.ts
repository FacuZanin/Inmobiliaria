import { Inject, Injectable } from '@nestjs/common';
import { VisitRepositoryPort } from '@/modules/visits/domain/repositories/visit.repository.port';
import { VISIT_REPOSITORY } from '../tokens';

@Injectable()
export class ListMyVisitsUseCase {
  constructor(
    @Inject(VISIT_REPOSITORY)
    private readonly repository: VisitRepositoryPort,
  ) {}

  execute(requesterId: number) {
    return this.repository.findByRequester(requesterId);
  }
}
