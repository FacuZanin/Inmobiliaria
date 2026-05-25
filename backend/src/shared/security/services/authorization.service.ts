// backend\src\shared\security\services\authorization.service.ts

import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { User } from '@/modules/user/domain/entities/user.entity';

import { PropertyAggregate }
from '@/modules/propiedades/domain/entities/property.aggregate';

import { PropertyOwnershipPolicy }
from '../policies/property-ownership.policy';

import { PublicacionOwnershipPolicy }
from '../policies/publicacion-ownership.policy';

import { UserOwnershipPolicy }
from '../policies/user-ownership.policy';

import { Permission }
from '@shared/contracts/enums/permission.enum';

import { ROLE_PERMISSIONS }
from '../access-control/role-permissions';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly propertyOwnership:
      PropertyOwnershipPolicy,

    private readonly userOwnership:
      UserOwnershipPolicy,
  ) {}

  // =====================================================
  // PERMISSIONS
  // =====================================================

  hasPermission(
    user: User,
    permission: Permission,
  ): boolean {
    const permissions =
      ROLE_PERMISSIONS[user.role] ?? [];

    return permissions.includes(permission);
  }

  hasAnyPermission(
    user: User,
    permissions: Permission[],
  ): boolean {
    return permissions.some(
      (permission) =>
        this.hasPermission(
          user,
          permission,
        ),
    );
  }

  hasAllPermissions(
    user: User,
    permissions: Permission[],
  ): boolean {
    return permissions.every(
      (permission) =>
        this.hasPermission(
          user,
          permission,
        ),
    );
  }

  // =====================================================
  // PROPERTY
  // =====================================================

  assertCanEditProperty(
    user: User,
    property: PropertyAggregate,
  ): void {
    if (
      !this.propertyOwnership.canModify(
        user,
        property,
      )
    ) {
      throw new ForbiddenException(
        'No puedes editar esta propiedad',
      );
    }
  }

  assertCanDeleteProperty(
    user: User,
    property: PropertyAggregate,
  ): void {
    if (
      !this.propertyOwnership.canDelete(
        user,
        property,
      )
    ) {
      throw new ForbiddenException(
        'No puedes eliminar esta propiedad',
      );
    }
  }

  assertCanViewPrivateProperty(
    user: User,
    property: PropertyAggregate,
  ): void {
    if (
      !this.propertyOwnership.canViewPrivate(
        user,
        property,
      )
    ) {
      throw new ForbiddenException(
        'No puedes acceder a esta propiedad',
      );
    }
  }

  // =====================================================
  // USER
  // =====================================================

  assertCanManageUser(
    currentUser: User,
    targetUser: User,
  ): void {
    if (
      !this.userOwnership.canManage(
        currentUser,
        targetUser,
      )
    ) {
      throw new ForbiddenException(
        'No puedes administrar este usuario',
      );
    }
  }
}