// backend\src\modules\auth\infrastructure\guards\jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { USER_REPOSITORY } from '@/modules/user/application/tokens';
import type { UserRepositoryPort } from '@/modules/user/application/ports/user-repository.port';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../../shared/security/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
  private reflector: Reflector,

  @Inject(USER_REPOSITORY)
  private readonly userRepo: UserRepositoryPort,
) {
  super();
}

async canActivate(context: ExecutionContext) {
  const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (isPublic) {
    return true;
  }

  // 👇 ejecuta el guard original
  const result = (await super.canActivate(context)) as boolean;

  const request = context.switchToHttp().getRequest();
  const user = request.user;

  // 🔥 VALIDACIÓN tokenVersion
  const dbUser = await this.userRepo.findById(user.sub);

  if (!dbUser) {
    throw new UnauthorizedException('Usuario no existe');
  }

  if (dbUser.tokenVersion !== user.tokenVersion) {
    throw new UnauthorizedException('Token inválido');
  }

  // 🚨 BLOQUEO PERFIL
  if (!user.role || !user.profile) {
    const allowedRoutes = [
      '/users/complete-profile',
      '/auth/refresh',
    ];

    const isAllowed = allowedRoutes.some(route =>
      request.url.includes(route),
    );

    if (!isAllowed) {
      throw new ForbiddenException('Debe completar su perfil');
    }
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