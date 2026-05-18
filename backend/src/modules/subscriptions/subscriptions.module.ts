// backend\src\modules\subscriptions\subscriptions.module.ts
import { Module } from '@nestjs/common';

import { PropertyLimitsService } from './application/services/property-limits.service';

@Module({
  providers: [PropertyLimitsService],
  exports: [PropertyLimitsService],
})
export class SubscriptionsModule {}