// backend\src\modules\user\application\use-cases\become-agency.usecase.ts
import { Inject, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { UserType } from '@shared/contracts/enums/user-type.enum';

export class BecomeAgencyUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.tipo === UserType.AGENCIA) {
      throw new BadRequestException('Ya sos agencia');
    }

    user.tipo = UserType.AGENCIA;

    await this.userRepository.save(user);

    return {
      message: 'Ahora sos agencia',
    };
  }
}