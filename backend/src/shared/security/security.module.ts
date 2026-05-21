// backend\src\shared\security\security.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { UsersModule } from '@/modules/user/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class SecurityModule {}