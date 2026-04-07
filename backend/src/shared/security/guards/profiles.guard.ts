import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROFILES_KEY } from '../decorators/profiles.decorator';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ 1. Primero: verificar si es ruta pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // ✅ 2. Obtener perfiles requeridos
    const requiredProfiles =
      this.reflector.getAllAndOverride<UserProfile[]>(PROFILES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // ✅ 3. Si no hay perfiles requeridos → permitir
    if (!requiredProfiles || requiredProfiles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ✅ 4. Validar autenticación
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    // ✅ 5. Validar perfil
    if (!requiredProfiles.includes(user.profile)) {
      throw new ForbiddenException('Perfil no autorizado');
    }

    return true;
  }
}console.log('ProfilesGuard ejecutándose');
