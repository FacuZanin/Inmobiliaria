// backend\src\modules\auth\infrastructure\guards\jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { FindUserByIdUseCase } from '@/modules/user/application/use-cases/find-user-by-id.usecase';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../../shared/security/decorators/public.decorator';
import { ALLOW_INCOMPLETE_PROFILE } from '@/shared/security/decorators/allow-incomplete-profile.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {
    super();
    console.log('✅ NUEVO JwtAuthGuard cargado');
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('HEADERS:', request.headers);

    // 🔓 ENDPOINT PUBLICO
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 👇 Ejecuta JWT
    const result = (await super.canActivate(context)) as boolean;
    const user = request.user;

    // 🔥 VALIDAR USUARIO EN DB
    const dbUser = await this.findUserByIdUseCase.execute(user.sub);

    if (!dbUser) {
      throw new UnauthorizedException('Usuario no existe');
    }

    request.user = dbUser;

    console.log('TOKEN:', user);
    console.log('DB USER:', dbUser);

    // 🔐 tokenVersion
    if (dbUser.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Token inválido');
    }

    return result;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      console.log('JWT ERROR:', err, info);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
