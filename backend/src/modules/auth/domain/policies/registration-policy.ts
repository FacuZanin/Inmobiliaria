// backend\src\modules\auth\domain\policies\registration-policy.ts
import { UserProfile } from '@shared/contracts';

export class RegistrationPolicy {
  static canRegister(profile: UserProfile) {
    return [UserProfile.INQUILINO].includes(profile);
  }
}
