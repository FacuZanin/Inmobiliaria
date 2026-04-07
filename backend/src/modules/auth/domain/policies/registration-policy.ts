// backend\src\modules\auth\domain\policies\registration-policy.ts
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

export class RegistrationPolicy {
  static canRegister(profile: UserProfile) {
    return [UserProfile.INQUILINO].includes(profile);
  }
}
