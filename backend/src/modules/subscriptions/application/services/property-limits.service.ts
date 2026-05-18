// backend\src\modules\subscriptions\application\services\property-limits.service.ts
import { Injectable } from '@nestjs/common';

import { SubscriptionPlan } from '@shared/contracts/enums/subscription-plan.enum';

@Injectable()
export class PropertyLimitsService {
  getMaxProperties(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 3;

      case SubscriptionPlan.BASIC:
        return 25;

      case SubscriptionPlan.PREMIUM:
        return 999999;

      case SubscriptionPlan.ENTERPRISE:
        return 999999;

      default:
        return 0;
    }
  }

  canCreateProperty(
    plan: SubscriptionPlan,
    currentProperties: number,
  ): boolean {
    return currentProperties < this.getMaxProperties(plan);
  }
}