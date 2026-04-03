// backend\src\modules\auth\application\types\jwt-payload.type.ts
import { UserRole } from '@shared/enums/user-role.enum';
import { UserProfile } from '@shared/enums/user-profile.enum';

export type JwtPayload = {
  sub: number;
  role: UserRole;
  profile: UserProfile;
  tokenVersion?: number;
};

