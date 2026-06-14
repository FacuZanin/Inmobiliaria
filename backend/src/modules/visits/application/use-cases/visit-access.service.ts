import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { VisitEntity } from '@/modules/visits/domain/entities/visit.entity';
import { UserRole } from '@shared/contracts/enums/user-role.enum';

@Injectable()
export class VisitAccessService {
  assertRequester(user: JwtPayload & { id?: number }, visit: VisitEntity) {
    const userId = user.id ?? user.sub;

    if (user.role === UserRole.SUPERADMIN || visit.requesterId === userId) {
      return;
    }

    throw new ForbiddenException('You cannot manage this visit request');
  }

  assertOwner(user: JwtPayload & { id?: number }, visit: VisitEntity) {
    const userId = user.id ?? user.sub;

    if (user.role === UserRole.SUPERADMIN || visit.ownerId === userId) {
      return;
    }

    if (user.agencia?.id && visit.agencyId === user.agencia.id) {
      return;
    }

    throw new ForbiddenException('You cannot manage this listing visit');
  }

  assertParticipant(user: JwtPayload & { id?: number }, visit: VisitEntity) {
    try {
      this.assertRequester(user, visit);
    } catch {
      this.assertOwner(user, visit);
    }
  }
}
