// backend\src\modules\user\application\use-cases\update-my-profile.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { UpdateMyProfileDto } from '../dto/update-my-profile.dto';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { UserMapper } from '../../domain/mappers/user.mapper';

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(userId: number, dto: UpdateMyProfileDto) {
    const user = await this.users.getByIdOrFail(userId);
    const updated = await this.users.update(user.id, dto);
    return UserMapper.toDomain(updated);
  }
}
