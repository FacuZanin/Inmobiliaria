// backend\src\core\security\policies\policies.module.ts
import { Global, Module } from '@nestjs/common';

import { PropertyOwnershipPolicy } from './property-ownership.policy';

@Global()
@Module({
  providers: [
    PropertyOwnershipPolicy,
  ],
  exports: [
    PropertyOwnershipPolicy,
  ],
})
export class PoliciesModule {}