// backend\src\modules\auth\application\types\jwt-payload.type.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';

export type JwtPayload = {
  sub: number;
  role: UserRole;
  tokenVersion?: number;
};

