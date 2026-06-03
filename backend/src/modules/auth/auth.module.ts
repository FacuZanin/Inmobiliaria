// backend/src/modules/auth/auth.module.ts
import { Module, forwardRef, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '@modules/auth/infrastructure/controllers/auth.controller';

// Use cases
import { LoginUseCase } from '@modules/auth/application/use-cases/login.usecase';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.usecase';
import { RefreshTokenUseCase } from '@modules/auth/application/use-cases/refresh-token.usecase';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.usecase';

// Services
import { JwtTokenService } from '@modules/auth/infrastructure/services/jwt-token.service';
import { PasswordHasherService } from '@modules/auth/infrastructure/services/password-hasher.service';
import { RefreshTokenService } from '@modules/auth/application/services/refresh-token.service';

// Entities
import { RefreshToken } from '@/modules/auth/infrastructure/persistence/typeorm/entities/refresh-token.entity';

// Guards / Strategy
import { JwtStrategy } from '@modules/auth/infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';

import { UserTypeGuard } from '@/core/shared/security/guards/user-type.guard';

// Ports
import {
  TOKEN_SERVICE,
  PASSWORD_HASHER,
} from '@modules/auth/application/tokens';

// User module
import { UsersModule } from '@/modules/users/users.module';
import { AgenciasModule } from '@/modules/agencies/agencias.module';

const JWT_SECRET = process.env.JWT_SECRET;
@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    AgenciasModule,
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],

  controllers: [AuthController],

  providers: [
    RefreshTokenService,

    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    JwtStrategy,

    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },

    {
      provide: PASSWORD_HASHER,
      useClass: PasswordHasherService,
    },
  ],

  exports: [PassportModule, RefreshTokenService, JwtModule],
})
export class AuthModule {}
