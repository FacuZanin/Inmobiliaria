// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\transactional-repository.factory.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { DocumentTypeOrmRepository } from '../document.typeorm.repository';
import { DocumentAuditTypeOrmRepository } from '../document-audit.typeorm.repository';

@Injectable()
export class TransactionalRepositoryFactory {
  create(manager: EntityManager) {
    return {
      documents: new DocumentTypeOrmRepository(
        manager,
      ),

      audits: new DocumentAuditTypeOrmRepository(
        manager,
      ),
    };
  }
}