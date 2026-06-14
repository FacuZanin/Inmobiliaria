import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { OperationEntity } from '@/modules/operaciones/domain/entities/operation.entity';
import { UserRole } from '@shared/contracts/enums/user-role.enum';

@Injectable()
export class OperationAccessService {
  assertBuyer(user: JwtPayload & { id?: number }, operation: OperationEntity) {
    const userId = user.id ?? user.sub;

    if (user.role === UserRole.SUPERADMIN || operation.buyerId === userId) {
      return;
    }

    throw new ForbiddenException('You cannot manage this operation');
  }

  assertOwner(user: JwtPayload & { id?: number }, operation: OperationEntity) {
    const userId = user.id ?? user.sub;

    if (user.role === UserRole.SUPERADMIN || operation.ownerId === userId) {
      return;
    }

    if (user.agencia?.id && operation.agencyId === user.agencia.id) {
      return;
    }

    throw new ForbiddenException('You cannot manage this operation');
  }

  assertParticipant(user: JwtPayload & { id?: number }, operation: OperationEntity) {
    try {
      this.assertBuyer(user, operation);
    } catch {
      this.assertOwner(user, operation);
    }
  }
}
