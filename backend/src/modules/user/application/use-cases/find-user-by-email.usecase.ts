// backend\src\modules\user\application\use-cases\find-user-by-email.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { UserMapper } from '../../domain/mappers/user.mapper';
import type { UserRepositoryPort } from '../ports/user-repository.port';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {return null;}
    return UserMapper.toDomain(user);
  }
}