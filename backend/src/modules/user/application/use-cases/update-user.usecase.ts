// backend\src\modules\user\application\use-cases\update-user.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../../domain/mappers/user.mapper';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { ensureNotEmpty } from '../../../../shared/utils/validators/ensure-not-empty';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateUserDto) {
    ensureNotEmpty(dto);
    const user = await this.users.getByIdOrFail(id);
    const updated = await this.users.update(user.id, dto);
    return UserMapper.toDomain(updated);
  }
}
