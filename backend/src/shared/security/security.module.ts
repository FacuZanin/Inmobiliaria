// backend\src\shared\security\security.module.ts

import { Global, Module } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { AccessGuard } from './guards/access.guard';

import { UsersModule } from '@/modules/user/users.module';
import { PoliciesModule } from './policies/policies.module';

import { PropertyOwnershipPolicy } from './policies/property-ownership.policy';
import { PublicacionOwnershipPolicy } from './policies/publicacion-ownership.policy';
import { UserOwnershipPolicy } from './policies/user-ownership.policy';
import { PropertyPublisherPolicy } from './policies/property-publisher.policy';

import { AuthorizationService } from './services/authorization.service';
@Global()
@Module({
  imports: [UsersModule, PoliciesModule],
  providers: [
    JwtAuthGuard,
    AccessGuard,
    PropertyOwnershipPolicy,
    PublicacionOwnershipPolicy,
    UserOwnershipPolicy,
    PropertyPublisherPolicy,
    AuthorizationService,
  ],
  exports: [
    JwtAuthGuard,
    AccessGuard,
    PoliciesModule,
    PropertyOwnershipPolicy,
    PublicacionOwnershipPolicy,
    UserOwnershipPolicy,
    PropertyPublisherPolicy,
    AuthorizationService,
  ],
})
export class SecurityModule {}
