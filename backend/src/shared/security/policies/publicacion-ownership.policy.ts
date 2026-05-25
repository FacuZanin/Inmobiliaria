// backend/src/shared/security/policies/publicacion-ownership.policy.ts

import { Injectable } from '@nestjs/common';

import { User }
from '@/modules/user/domain/entities/user.entity';

import { PropertyAggregate }
from '@/modules/propiedades/domain/entities/property.aggregate';

import { Permission }
from '@shared/contracts/enums/permission.enum';

@Injectable()
export class PublicacionOwnershipPolicy {
  canManage(
    user: User,
    property: PropertyAggregate,
  ): boolean {
    if (
      user.permissions?.includes(
        Permission.PUBLICACION_APPROVE,
      )
    ) {
      return true;
    }

    if (property.creadoPorId === user.id) {
      return true;
    }

    if (
      property.agenciaId &&
      property.agenciaId === user.agencia?.id
    ) {
      return true;
    }

    return false;
  }

  canPause(
    user: User,
    property: PropertyAggregate,
  ) {
    return this.canManage(
      user,
      property,
    );
  }

  canDelete(
    user: User,
    property: PropertyAggregate,
  ) {
    return this.canManage(
      user,
      property,
    );
  }

  canEdit(
    user: User,
    property: PropertyAggregate,
  ) {
    return this.canManage(
      user,
      property,
    );
  }
}