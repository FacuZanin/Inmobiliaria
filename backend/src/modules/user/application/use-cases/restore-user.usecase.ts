// backend\src\modules\user\application\use-cases\restore-user.usecase.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { AuditService } from '../../../audit/application/audit.service';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { UserMapper } from '../../domain/mappers/user.mapper';

@Injectable()
export class RestoreUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    private readonly auditService: AuditService,
  ) {}

   async execute(id: number) {
  const user = await this.users.getByIdOrFail(id);

  await this.users.restore(id);

  await this.auditService.log({
    action: 'RESTORE_USER',
    entity: 'User',
    entityId: id,
    oldValue: user,
    newValue: { restored: true },
  });

  return UserMapper.toDomain(user);
}
}
