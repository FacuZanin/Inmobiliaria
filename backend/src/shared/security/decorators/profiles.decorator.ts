// backend\src\common\decorators\profiles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserProfile } from '@shared/contracts';

export const PROFILES_KEY = 'profiles';
export const Profiles = (...profiles: UserProfile[]) =>
  SetMetadata(PROFILES_KEY, profiles);
