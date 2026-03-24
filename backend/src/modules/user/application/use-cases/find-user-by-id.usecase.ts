// backend\src\modules\user\application\use-cases\find-user-by-id.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { UserMapper } from '../../domain/mappers/user.mapper';
import type { UserRepositoryPort } from '../ports/user-repository.port';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(id: number) {
  const user = await this.users.findById(id);
  if (!user) return null;

  return UserMapper.toDomain(user);
}
}