// backend\src\modules\auth\application\types\jwt-payload.type.ts
import { UserRole, UserProfile } from '@shared/contracts';

export type JwtPayload = {
  sub: number;
  role: UserRole;
  profile: UserProfile;
  tokenVersion?: number;
};

