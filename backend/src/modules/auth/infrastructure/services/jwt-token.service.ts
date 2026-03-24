// backend\src\modules\auth\infrastructure\services\jwt-token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../application/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwt: JwtService) {}

  async sign(payload: any): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async signRefresh(payload: { sub: number; tokenVersion: number }): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  async verifyRefresh(token: string): Promise<{ sub: number; tokenVersion: number }> {
  return this.jwt.verifyAsync(token, {
    secret: process.env.JWT_REFRESH_SECRET,
  });
}

}