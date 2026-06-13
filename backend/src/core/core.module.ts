// backend/src/core/core.module.ts
import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmUnitOfWork } from './infrastructure/persistence/typeorm/typeorm-unit-of-work';
import { InMemoryDomainEventPublisher } from './infrastructure/events/in-memory-domain-event-publisher';
import { QueueDomainEventPublisher } from './infrastructure/events/queue-domain-event-publisher';
import { PinoLoggerAdapter } from './infrastructure/logger/pino-logger.adapter';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { TimingInterceptor } from './infrastructure/interceptors/timing.interceptor';
import { AuditInterceptor } from './infrastructure/interceptors/audit.interceptor';
import { UNIT_OF_WORK } from './application/unit-of-work/unit-of-work.token';
import { DOMAIN_EVENT_PUBLISHER } from './application/ports/domain-event-publisher.token';
import { LOGGER } from './application/ports/logger.token';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // ── Unit of Work ─────────────────────────────────────
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },

    // ── Event Publisher (condicional por entorno) ─────────
    {
      provide: DOMAIN_EVENT_PUBLISHER,
      useFactory: (config: ConfigService) =>
        config.get('NODE_ENV') === 'production'
          ? new QueueDomainEventPublisher()
          : new InMemoryDomainEventPublisher(),
      inject: [ConfigService],
    },

    // ── Logger ────────────────────────────────────────────
    {
      provide: LOGGER,
      useClass: PinoLoggerAdapter,
    },

    // ── Filtros globales (orden importa: más específico primero) ──
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },

    // ── Interceptors globales ─────────────────────────────
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [UNIT_OF_WORK, DOMAIN_EVENT_PUBLISHER, LOGGER],
})
export class CoreModule {}
