// backend\src\modules\auth\infrastructure\strategies\jwt.strategy.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { USER_REPOSITORY } from '../../../user/application/tokens';
import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import { UserStatus} from '@shared/contracts/enums/user-status.enum';
import { TokenPayload } from '../../domain/token-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.users.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const currentTokenVersion = await this.users.getTokenVersion(user.id);

    if (currentTokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  }
}
