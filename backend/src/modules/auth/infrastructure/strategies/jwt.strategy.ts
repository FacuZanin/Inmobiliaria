// backend\src\modules\auth\infrastructure\strategies\jwt.strategy.ts
import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.users.findById(Number(payload.sub));

    // 🔒 usuario inexistente
    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    // 🔒 usuario bloqueado/inactivo
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Usuario inactivo o bloqueado',
      );
    }

    // 🔒 JWT invalidado por logout
    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException(
        'Token expirado o invalidado',
      );
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tipo: user.tipo,
      status: user.status,
      tokenVersion: user.tokenVersion,
    };
  }
}