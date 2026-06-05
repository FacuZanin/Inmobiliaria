// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\transaction\documents-typeorm.unit-of-work.ts
import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { DomainEvent } from '@/core/domain/events/domain-event';

import { DocumentsUnitOfWorkPort } from '@/modules/documents/application/ports/unit-of-work.port';
import { DomainEventPublisherPort } from '@/core/application/ports/domain-event-publisher.port';

import { TransactionalRepositoryFactory } from './transactional-repository.factory';

@Injectable()
export class DocumentsTypeOrmUnitOfWork
  implements DocumentsUnitOfWorkPort
{
  constructor(
    private readonly dataSource: DataSource,

    private readonly repositoryFactory: TransactionalRepositoryFactory,

    private readonly domainEventPublisher: DomainEventPublisherPort,
  ) {}

  async execute<T>(
    work: Parameters<
      DocumentsUnitOfWorkPort['execute']
    >[0],
  ): Promise<T> {
    return this.dataSource.transaction<T>(
      async (manager) => {
        const repositories =
          this.repositoryFactory.create(manager);

        const collectedEvents: DomainEvent[] =
          [];

        const result = await work(
          repositories,

          (events: DomainEvent[]) => {
            collectedEvents.push(...events);
          },
        );

        if (collectedEvents.length > 0) {
          await this.domainEventPublisher.publishAll(
            collectedEvents,
          );
        }

        return result;
      },
    );
  }
}