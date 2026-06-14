import { Inject, Injectable } from '@nestjs/common';
import { OperationRepositoryPort } from '@/modules/operaciones/domain/repositories/operation.repository.port';
import { OPERATION_REPOSITORY } from '../tokens';

@Injectable()
export class ListMyOperationsUseCase {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly repository: OperationRepositoryPort,
  ) {}

  execute(buyerId: number) {
    return this.repository.findByBuyer(buyerId);
  }
}
