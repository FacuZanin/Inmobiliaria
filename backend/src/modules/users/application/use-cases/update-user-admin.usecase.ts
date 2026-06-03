// backend\src\modules\user\application\use-cases\update-user-admin.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { UserMapper } from '../../domain/mappers/user.mapper';

@Injectable()
export class UpdateUserAdminUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

async execute(id: number, dto: UpdateUserAdminDto) {
  const user = await this.users.getByIdOrFail(id);
  const updated = await this.users.update(user.id, dto);
  return UserMapper.toDomain(updated);
}

}
