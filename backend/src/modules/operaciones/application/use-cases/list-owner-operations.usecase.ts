import { Inject, Injectable } from '@nestjs/common';
import { OperationRepositoryPort } from '@/modules/operaciones/domain/repositories/operation.repository.port';
import { OPERATION_REPOSITORY } from '../tokens';

@Injectable()
export class ListOwnerOperationsUseCase {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly repository: OperationRepositoryPort,
  ) {}

  execute(ownerId: number, agencyId?: number | null) {
    return this.repository.findByOwner(ownerId, agencyId);
  }
}
