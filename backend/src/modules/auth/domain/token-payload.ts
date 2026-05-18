// backend\src\modules\auth\domain\token-payload.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { SubscriptionPlan } from '@shared/contracts/enums/subscription-plan.enum';

export interface TokenPayload {
  sub: number;
  email: string;
  role: UserRole;
  tokenVersion: number;
  iat?: number;
  exp?: number;
  tipo: UserType;
  plan: SubscriptionPlan;
}
