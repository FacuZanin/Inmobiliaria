import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AgenciasModule } from './agencias/agencias.module';
import { OperacionesModule } from './operaciones/operaciones.module';
import { PropiedadesModule } from './propiedades/propiedades.module';
import { UploadsModule } from './uploads/uploads.module';
import { PropietarioDocumentosModule } from './propietario-documentos/propietario-documentos.module';
import { InquilinosModule } from './inquilinos/inquilinos.module';
import { InquilinoDocumentosModule } from './inquilino-documentos/inquilino-documentos.module';

import ormconfig from './database/typeorm.config';

import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { AppLogger } from './common/logger/app-logger.service';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    AuthModule,
    AgenciasModule,
    PropiedadesModule,
    OperacionesModule,
    UploadsModule,
    PropietarioDocumentosModule,
    InquilinosModule,
    InquilinoDocumentosModule,
  ],

  controllers: [AppController],

  providers: [
    AppLogger,
    AppService,

    // Interceptores globales
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },

    // Guards globales
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
