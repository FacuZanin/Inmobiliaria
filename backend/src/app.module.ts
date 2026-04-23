// backend\src\app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import ormconfig from './database/typeorm.config';

import { AppController } from './app.controller';

// MÓDULOS DE DOMINIO
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { AgenciasModule } from './modules/agencias/agencias.module';
import { PropiedadesModule } from './modules/propiedades/propiedades.module';
import { OperacionesModule } from './modules/operaciones/operaciones.module';
import { InquilinosModule } from './modules/inquilinos/inquilinos.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SecurityModule } from './shared/security/security.module';

// GLOBALS
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/infrastructure/guards/jwt-auth.guard';

import { RolesGuard } from './shared/security/guards/roles.guard';
import { ProfilesGuard } from './shared/security/guards/profiles.guard';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/infrastructure/interceptors/logging.interceptor';
import { TimingInterceptor } from './shared/infrastructure/interceptors/timing.interceptor';
import { ValidationPipe } from './shared/infrastructure/pipes/validation.pipe';

// LOGGER
import { LoggerModule } from './shared/infrastructure/logger/logger.module';

// HEALTH
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    // DB
    TypeOrmModule.forRoot(ormconfig),

    // LOGGER GLOBAL
    LoggerModule,

    // DOMAINS
    HealthModule,
    AuthModule,
    UsersModule,
    AgenciasModule,
    PropiedadesModule,
    OperacionesModule,
    InquilinosModule,
    UploadsModule,

    // Security
    SecurityModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    // 🔐 AUTH GLOBAL
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ProfilesGuard,
    },

    // PIPE GLOBAL
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },

    // FILTER GLOBAL
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // INTERCEPTORS GLOBALES
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
  ],
})
export class AppModule {}
