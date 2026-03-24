// backend\src\modules\auth\infrastructure\services\token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenServicePort } from '../../application/ports/token-service.port';


@Injectable()
export class TokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async signRefresh(payload: { sub: number; tokenVersion: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  async verifyRefresh(token: string) {
  return this.jwtService.verifyAsync(token, {
    secret: process.env.JWT_REFRESH_SECRET,
  });
}

}
