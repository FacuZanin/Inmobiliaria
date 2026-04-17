import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TOKEN_SERVICE } from '../tokens';
import { RefreshTokenService } from '../services/refresh-token.service';

import { USER_REPOSITORY } from '@/modules/user/application/tokens';

import type { TokenServicePort } from '../ports/token-service.port';
import type { UserRepositoryPort } from '@/modules/user/application/ports/user-repository.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,

    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(oldRefreshToken: string) {
    const { refreshToken: newRefreshToken, user } =
      await this.refreshTokenService.rotate(oldRefreshToken);

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      role: user.role,
      profile: user.profile,
      jti: randomUUID(),
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }
}