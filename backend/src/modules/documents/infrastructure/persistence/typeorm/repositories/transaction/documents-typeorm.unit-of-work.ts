// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\transaction\documents-typeorm.unit-of-work.ts
import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import type { DomainEvent } from '@/core/domain/events/domain-event.base';

import { DocumentsUnitOfWorkPort } from '@/modules/documents/application/ports/unit-of-work.port';
import { IDomainEventPublisher } from '@/core/domain/events/domain-event-publisher.interface';
import { DOMAIN_EVENT_PUBLISHER } from '@/core/application/ports/domain-event-publisher.token';

import { TransactionalRepositoryFactory } from './transactional-repository.factory';

@Injectable()
export class DocumentsTypeOrmUnitOfWork implements DocumentsUnitOfWorkPort {
  constructor(
    private readonly dataSource: DataSource,

    private readonly repositoryFactory: TransactionalRepositoryFactory,

    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly domainEventPublisher: IDomainEventPublisher,
  ) {}

  async execute<T>(
    work: (
      ...args: Parameters<Parameters<DocumentsUnitOfWorkPort['execute']>[0]>
    ) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction<T>(async (manager) => {
      const repositories = this.repositoryFactory.create(manager);

      const collectedEvents: DomainEvent[] = [];

      const result = await work(
        repositories,

        (events: DomainEvent[]) => {
          collectedEvents.push(...events);
        },
      );

      if (collectedEvents.length > 0) {
        await this.domainEventPublisher.publish(collectedEvents);
      }

      return result;
    });
  }
}
