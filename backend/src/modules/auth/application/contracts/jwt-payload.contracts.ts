// backend\src\modules\auth\application\contracts\jwt-payload.contracts.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { SubscriptionPlan } from '@shared/contracts/enums/subscription-plan.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
  tokenVersion: number;
  tipo: UserType;
  plan: SubscriptionPlan;
  iat?: number;
  exp?: number;
};