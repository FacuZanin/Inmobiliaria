// backend\src\common\guards\profiles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROFILES_KEY } from '../decorators/profiles.decorator';
import { UserProfile } from '@shared/enums/user-profile.enum';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredProfiles =
      this.reflector.getAllAndOverride<UserProfile[]>(PROFILES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredProfiles || requiredProfiles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    if (!requiredProfiles.includes(user.profile)) {
      throw new ForbiddenException('Perfil no autorizado');
    }

    return true;
  }
}
