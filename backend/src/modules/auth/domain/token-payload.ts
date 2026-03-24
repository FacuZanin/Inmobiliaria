// backend\src\modules\auth\domain\token-payload.ts
import { UserRole, UserProfile } from '@shared/contracts';

export interface TokenPayload {
  sub: number;
  role: UserRole;
  profile: UserProfile;
  tokenVersion: number;
}
