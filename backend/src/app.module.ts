// backend\src\app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

import { AuditInterceptor } from '@/core/infrastructure/interceptors/audit.interceptor';
import { CoreModule } from '@/core/core.module';

import ormconfig from './database/typeorm.config';

import { AppController } from './app.controller';

// MÓDULOS DE DOMINIOAuditAction
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AgenciasModule } from './modules/agencies/agencias.module';
import { ListingsModule } from './modules/listings/listings.module';
import { InquilinosModule } from './modules/inquilinos/inquilinos.module';
import { FavoritosModule } from './modules/favorites/favoritos.module';
import { AuditModule } from './modules/audit/audit.module';

// GLOBALS
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { HttpExceptionFilter } from '@/core/infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from '@/core/infrastructure/interceptors/logging.interceptor';
import { TimingInterceptor } from '@/core/infrastructure/interceptors/timing.interceptor';
import { ValidationPipe } from '@nestjs/common';

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

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', '127.0.0.1'),
          port: Number(config.get('REDIS_PORT', 6379)),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          db: Number(config.get('REDIS_DB', 0)),
        },
      }),
    }),

    // DB
    TypeOrmModule.forRoot(ormconfig),

    CoreModule,

    // DOMAINS
    HealthModule,
    AuthModule,
    UsersModule,
    AgenciasModule,
    ListingsModule,
    InquilinosModule,
    FavoritosModule,
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
