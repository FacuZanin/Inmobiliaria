// backend\src\modules\auth\application\use-cases\login.usecase.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';

import { LoginDto } from '../dto/login.dto';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { TokenServicePort } from '../ports/token-service.port';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import { PASSWORD_HASHER, TOKEN_SERVICE } from '../tokens';

import { RefreshTokenService } from '../services/refresh-token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,

    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,

    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    const isValidPassword = await this.hasher.compare(
      dto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      profile: user.profile,
      tokenVersion: await this.users.getTokenVersion(user.id),
    };

    // 🔐 ACCESS TOKEN (JWT)
    const accessToken = await this.tokenService.sign(payload);

    // 🔁 REFRESH TOKEN (DB)
    const refreshToken = await this.refreshTokenService.create(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        nombre: user.nombre,
        apellido: user.apellido,
      },
    };
  }
}
