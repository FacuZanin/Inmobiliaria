// backend\src\app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuditInterceptor } from '@/shared/infrastructure/interceptors/audit.interceptor';

import ormconfig from './database/typeorm.config';

import { AppController } from './app.controller';

// MÓDULOS DE DOMINIOAuditAction
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { AgenciasModule } from './modules/agencias/agencias.module';
import { PropiedadesModule } from './modules/propiedades/propiedades.module';
import { OperacionesModule } from './modules/operaciones/operaciones.module';
import { InquilinosModule } from './modules/inquilinos/inquilinos.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { FavoritosModule } from './modules/favoritos/favoritos.module';
import { PublicacionesModule } from './modules/publicaciones/publicaciones.module';
import { AdminPublicacionesModule } from './modules/admin-publicaciones/admin-publicaciones.module';
import { AuditModule } from './modules/audit/audit.module';

// GLOBALS
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

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
    FavoritosModule,
    PublicacionesModule,
    AdminPublicacionesModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
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
