//backend\src\modules\auth\application\use-cases\register.usecase.ts
import { Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';

import { RegisterDto } from '../dto/register.dto';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: RegisterDto) {
    if (dto.email !== dto.repeatEmail) {
      throw new BadRequestException('Los emails no coinciden');
    }

    if (dto.password !== dto.repeatPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
      tipo: UserType.USER,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    return {
      message: 'Usuario creado correctamente',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
