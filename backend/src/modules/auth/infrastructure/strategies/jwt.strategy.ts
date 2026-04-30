// backend\src\modules\auth\infrastructure\strategies\jwt.strategy.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';
import { TokenPayload } from '../../domain/token-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {
    console.log('JWT SECRET:', process.env.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.users.findById(Number(payload.sub));

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // 🔥 IMPORTANTE: devolver el payload + data actualizada
    return {
      sub: payload.sub,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
  }
}
