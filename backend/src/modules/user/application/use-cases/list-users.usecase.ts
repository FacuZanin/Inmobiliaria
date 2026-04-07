// backend\src\modules\user\application\use-cases\list-users.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { UserFiltersDto } from '../dto/user-filters.dto';
import { USER_REPOSITORY } from '../tokens';
import { UserMapper } from '../../domain/mappers/user.mapper';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(filters: UserFiltersDto) {
    const users = await this.userRepository.findAll(filters);
    return users.map(UserMapper.toDomain);
  }
}
