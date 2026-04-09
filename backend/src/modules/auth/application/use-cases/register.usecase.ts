//backend\src\modules\auth\application\use-cases\register.usecase.ts
import {
  Inject,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { RegisterDto } from '../dto/register.dto';

import { UserStatus } from '@shared/contracts/enums/user-status.enum';
import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import { PASSWORD_HASHER } from '../tokens';

import { Password } from '../../domain/value-objects/password.vo';
import { Email } from '../../domain/value-objects/email.vo';

import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,

    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(dto: RegisterDto) {
    // 🔥 Validaciones de igualdad (correcto lugar)
    if (dto.email !== dto.repeatEmail) {
      throw new BadRequestException('Los emails no coinciden');
    }

    if (dto.password !== dto.repeatPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const exists = await this.users.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    const email = Email.create(dto.email);
    const password = await Password.create(dto.password, this.hasher);

    const user = await this.users.create({
      email: email.value,
      password: password.value,
      role: UserRole.USER,
      profile: null,
    });

    return {
      id: user.id,
      email: user.email,
      status: user.status,
    };
  }
}
