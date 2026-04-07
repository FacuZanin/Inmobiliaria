// backend/src/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AuthController } from './infrastructure/controllers/auth.controller';

// Use cases
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';

// Services
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { PasswordHasherService } from './infrastructure/services/password-hasher.service';
import { RefreshTokenService } from './application/services/refresh-token.service';

// Entities
import { RefreshToken } from './infrastructure/entities/refresh-token.entity';

// Guards / Strategy
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/security/guards/roles.guard';

// Ports
import { TOKEN_SERVICE, PASSWORD_HASHER } from './application/tokens';

// User module
import { UsersModule } from '../user/users.module';
import { AgenciasModule } from '../agencias/agencias.module';

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
    RefreshTokenService,
  ],
})
export class AuthModule {}
