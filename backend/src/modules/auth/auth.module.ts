// backend/src/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './infrastructure/controllers/auth.controller';

// Use cases
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';

// Services
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { PasswordHasherService } from './infrastructure/services/password-hasher.service';

// Guards / Strategy
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

// Ports
import { TOKEN_SERVICE, PASSWORD_HASHER } from './application/tokens';

// User module
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],

  controllers: [AuthController],

  providers: [
    // Use cases
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    // Security
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,

    // Services
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: PasswordHasherService,
    },
  ],

  exports: [
    JwtAuthGuard,
    PassportModule,
  ],
})
export class AuthModule {}
