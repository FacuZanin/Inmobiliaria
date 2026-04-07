// backend\src\modules\auth\application\use-cases\refresh-token.usecase.ts
import { Injectable, Inject } from '@nestjs/common';

import { TOKEN_SERVICE } from '../tokens';
import { RefreshTokenService } from '../services/refresh-token.service';

import type { TokenServicePort } from '../ports/token-service.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(oldRefreshToken: string) {

    const { refreshToken: newRefreshToken, user } =
      await this.refreshTokenService.rotate(oldRefreshToken);

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      role: user.role,
      profile: user.profile,
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }
}
