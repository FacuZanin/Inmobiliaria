// backend\src\modules\auth\application\use-cases\logout.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user/application/tokens';
import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: number): Promise<void> {
    // Invalida todos los refresh tokens del usuario
    await this.userRepository.incrementTokenVersion(userId);
  }
}
