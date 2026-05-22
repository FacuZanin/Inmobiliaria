// backend/src/shared/security/policies/publicacion-ownership.policy.ts
import { Injectable } from '@nestjs/common';

import { User } from '@/modules/user/domain/entities/user.entity';

import { PublicacionEntity } from '@/modules/publicaciones/infrastructure/persistence/typeorm/entities/publicacion.entity';

import { Permission } from '@shared/contracts/enums/permission.enum';

@Injectable()
export class PublicacionOwnershipPolicy {
  canManage(
    user: User,
    publicacion: PublicacionEntity,
  ): boolean {
    if (
      user.permissions?.includes(
        Permission.PUBLICACION_APPROVE,
      )
    ) {
      return true;
    }

    if (
      publicacion.propiedad?.creadoPor?.id ===
      user.id
    ) {
      return true;
    }

    if (
      publicacion.propiedad?.agencia?.id &&
      publicacion.propiedad.agencia.id ===
        user.agencia?.id
    ) {
      return true;
    }

    return false;
  }

  canPause(
    user: User,
    publicacion: PublicacionEntity,
  ) {
    return this.canManage(
      user,
      publicacion,
    );
  }

  canDelete(
    user: User,
    publicacion: PublicacionEntity,
  ) {
    return this.canManage(
      user,
      publicacion,
    );
  }

  canEdit(
    user: User,
    publicacion: PublicacionEntity,
  ) {
    return this.canManage(
      user,
      publicacion,
    );
  }
}