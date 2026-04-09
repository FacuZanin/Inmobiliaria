// backend\src\modules\user\application\use-cases\complete-profile.usecase.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { AGENCIAS_REPOSITORY } from '@/modules/agencias/application/tokens';

import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

import type { UserRepositoryPort } from '../ports/user-repository.port';
import type { AgenciasRepositoryPort } from '@/modules/agencias/application/ports/agencias-repository.port';

@Injectable()
export class CompleteProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,

    @Inject(AGENCIAS_REPOSITORY)
    private readonly agenciaRepo: AgenciasRepositoryPort,
  ) {}

  async execute(userId: number, dto: any) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 🔥 evitar re-onboarding
    if (user.profile) {
      throw new BadRequestException('El perfil ya fue completado');
    }

    user.profile = dto.profile;
    user.nombre = dto.nombre ?? null;
    user.apellido = dto.apellido ?? null;
    user.telefono = dto.telefono ?? null;

    // 🔥 lógica de agencia
    if (dto.profile === UserProfile.AGENCIA) {
      if (!dto.agenciaNombre) {
        throw new BadRequestException('Nombre de agencia requerido');
      }

      const agencia = await this.agenciaRepo.createBasic({
        nombre: dto.agenciaNombre,
      });

      user.agencia = agencia;
    }

    return this.userRepo.save(user);
  }
}
