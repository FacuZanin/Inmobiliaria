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

// GLOBALS
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/infrastructure/guards/jwt-auth.guard';

import { RolesGuard } from './common/guards/roles.guard';
import { ProfilesGuard } from './common/guards/profiles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { GlobalExceptionInterceptor } from './common/interceptors/global-exception.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';

// LOGGER
import { AppLogger } from './common/logger/app-logger.service';

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

    // DOMAINS
    HealthModule,
    AuthModule,
    UsersModule,
    AgenciasModule,
    PropiedadesModule,
    OperacionesModule,
    InquilinosModule,
    UploadsModule,
  ],
  controllers: [
    AppController, // opcional
  ],
  providers: [
    AppLogger,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalExceptionInterceptor,
    },
  ],
})
export class AppModule {}
