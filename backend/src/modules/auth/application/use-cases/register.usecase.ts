// backend/src/modules/auth/application/use-cases/register.usecase.ts

import {
  Inject,
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { RegisterDto } from '../dto/register.dto';
import { RegisterToUserDto } from '../dto/register-to-user.dto';

import { UserStatus, UserRole } from '@shared/contracts';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import { PASSWORD_HASHER } from '../tokens';

import { RegistrationPolicy } from '../../domain/policies/registration-policy';
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
    const exists = await this.users.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    if (!RegistrationPolicy.canRegister(dto.profile)) {
      throw new ForbiddenException('Perfil no permitido');
    }

    const email = Email.create(dto.email);
    const password = await Password.create(dto.password, this.hasher);

    const userToCreate: RegisterToUserDto = {
      email: email.value,
      password: password.value,
      nombre: dto.nombre,
      apellido: dto.apellido,
      profile: dto.profile,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    };

    const user = await this.users.create(userToCreate);

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
      status: user.status,
    };
  }
}
