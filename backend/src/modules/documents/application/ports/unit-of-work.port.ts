// backend\src\modules\documents\application\ports\unit-of-work.port.ts
import type { DomainEvent } from '@/core/domain/events/domain-event';

import type { DocumentRepositoryPort } from '../../domain/repositories/document.repository.port';
import type { DocumentAuditRepositoryPort } from '../../domain/repositories/document-audit.repository.port';

export interface DocumentsTransactionalRepositories {
  documents: DocumentRepositoryPort;

  audits: DocumentAuditRepositoryPort;
}

export interface DocumentsUnitOfWorkPort {
  execute<T>(
    work: (
      repos: DocumentsTransactionalRepositories,
      collectDomainEvents: (events: DomainEvent[]) => void,
    ) => Promise<T>,
  ): Promise<T>;
}
