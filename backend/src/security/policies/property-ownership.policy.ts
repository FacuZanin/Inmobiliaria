// backend\src\core\security\policies\property-ownership.policy.ts

import { Injectable } from '@nestjs/common';

import { User }
from '@/modules/users/domain/entities/user.entity';

import { PropertyAggregate }
from '@/modules/propiedades/domain/entities/property.aggregate';

import { UserRole }
from '@shared/contracts/enums/user-role.enum';

@Injectable()
export class PropertyOwnershipPolicy {
  canManage(
    user: User,
    property: PropertyAggregate,
  ): boolean {
    if (user.role === UserRole.SUPERADMIN) {
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

  canModify(
    user: User,
    property: PropertyAggregate,
  ): boolean {
    return this.canManage(user, property);
  }

  canDelete(
    user: User,
    property: PropertyAggregate,
  ): boolean {
    return this.canManage(user, property);
  }

  canViewPrivate(
    user: User,
    property: PropertyAggregate,
  ): boolean {
    return this.canManage(user, property);
  }
}