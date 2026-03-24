// backend\src\modules\user\application\use-cases\delete-user.usecase.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { AuditService } from '../../../audit/application/audit.service';
import type { UserRepositoryPort } from '../ports/user-repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    private readonly auditService: AuditService,
  ) {}

  async execute(id: number) {
  const user = await this.users.getByIdOrFail(id);

  await this.users.softDelete(id);

  await this.auditService.log({
    action: 'DELETE_USER',
    entity: 'User',
    entityId: id,
    oldValue: user,
  });
}
}