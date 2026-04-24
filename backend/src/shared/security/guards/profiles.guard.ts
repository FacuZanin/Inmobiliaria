// backend\src\shared\security\guards\profiles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROFILES_KEY } from '../decorators/profiles.decorator';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOW_INCOMPLETE_PROFILE } from '../decorators/allow-incomplete-profile.decorator';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const allowIncomplete = this.reflector.getAllAndOverride<boolean>(
      ALLOW_INCOMPLETE_PROFILE,
      [context.getHandler(), context.getClass()],
    );

    if (allowIncomplete) {
      console.log('ALLOW INCOMPLETE PROFILE (ProfilesGuard)');
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredProfiles = this.reflector.getAllAndOverride<UserProfile[]>(
      PROFILES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredProfiles || requiredProfiles.length === 0) {
      return true;
    }

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('No autenticado');
    }

    if (!requiredProfiles.includes(user.profile)) {
      throw new ForbiddenException('Perfil no autorizado');
    }

    return true;
  }
}
