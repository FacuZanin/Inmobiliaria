// backend\src\modules\auth\domain\token-payload.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

export interface TokenPayload {
  sub: number;
  role: UserRole;
  profile: UserProfile;
  tokenVersion: number;
}
