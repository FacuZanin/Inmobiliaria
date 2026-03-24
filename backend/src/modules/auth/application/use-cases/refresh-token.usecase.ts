// backend\src\modules\auth\application\use-cases\refresh-token.usecase.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import { TOKEN_SERVICE } from '../tokens';

import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import type { TokenServicePort } from '../ports/token-service.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(refreshToken: string) {
  const payload = await this.tokenService.verifyRefresh(refreshToken);

  const user = await this.users.findById(payload.sub);
  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedException('Token inválido');
  }

  const newPayload = {
    sub: user.id,
    role: user.role,
    profile: user.profile,
    tokenVersion: user.tokenVersion,
  };

  return {
    access_token: this.tokenService.sign(newPayload),
    refresh_token: this.tokenService.signRefresh(newPayload),
  };
}
}