// backend/src/modules/auth/application/services/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../../domain/token-payload';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(payload: TokenPayload): string {
    return this.jwt.sign(payload, { expiresIn: '15m' });
  }

  signRefreshToken(payload: TokenPayload): string {
    return this.jwt.sign(payload, { expiresIn: '7d' });
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.jwt.verify(token);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.jwt.verify(token);
  }
}
