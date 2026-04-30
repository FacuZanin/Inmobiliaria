// backend\src\modules\auth\domain\token-payload.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';

export interface TokenPayload {
  sub: number;
  role: UserRole;
  tokenVersion: number;
}
