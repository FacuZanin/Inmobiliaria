import { ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { PropertyAggregate } from '../../domain/aggregates/property.aggregate';

export class PropertyOwnershipPolicy {
  canManage(user: JwtPayload, property: PropertyAggregate): boolean {
    if (user.role === UserRole.SUPERADMIN) {
      return true;
    }

    if (property.ownerId === user.sub) {
      return true;
    }

    if (
      user.agencia?.id &&
      property.agencyId &&
      user.agencia.id === property.agencyId
    ) {
      return true;
    }

    return false;
  }

  assertCanManage(user: JwtPayload, property: PropertyAggregate): void {
    if (!this.canManage(user, property)) {
      throw new ForbiddenException('No puedes administrar esta propiedad');
    }
  }
}
