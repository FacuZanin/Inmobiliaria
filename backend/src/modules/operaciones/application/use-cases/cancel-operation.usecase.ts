import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { OperationRepositoryPort } from '@/modules/operaciones/domain/repositories/operation.repository.port';
import { OperationAccessService } from '../services/operation-access.service';
import { OperationStatusSyncService } from '../services/operation-status-sync.service';
import { OPERATION_REPOSITORY } from '../tokens';

@Injectable()
export class CancelOperationUseCase {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly repository: OperationRepositoryPort,

    private readonly access: OperationAccessService,
    private readonly statusSync: OperationStatusSyncService,
  ) {}

  async execute(id: number, user: JwtPayload & { id?: number }, reason?: string | null) {
    const operation = await this.repository.findById(id);

    if (!operation) throw new NotFoundException('Operation not found');

    this.access.assertParticipant(user, operation);
    operation.cancel(user.id ?? user.sub, reason);

    const saved = await this.repository.save(operation);
    await this.statusSync.cancel(saved);

    return saved;
  }
}
