// backend\src\core\security\policies\property-publisher.policy.ts
import { Injectable } from '@nestjs/common';

import { User }
from '@/modules/users/domain/entities/user.entity';

import { getUserTypeCapabilities }
from '@/modules/users/domain/capabilities/property-publishers';

@Injectable()
export class PropertyPublisherPolicy {
  canPublish(
    user: User,
  ): boolean {
    const capabilities =
      getUserTypeCapabilities(user.tipo);

    return capabilities.canPublishProperties;
  }

  requiresAgency(
    user: User,
  ): boolean {
    const capabilities =
      getUserTypeCapabilities(user.tipo);

    return capabilities.requiresAgencyOnApproval;
  }
}