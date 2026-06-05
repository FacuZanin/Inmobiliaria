// backend\src\modules\documents\domain\repositories\document.repository.port.ts
import { DocumentEntity } from '../entities/document.entity';

import { DocumentOwnerType } from '../enums/document-owner-type.enum';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export interface DocumentRepositoryPort {
  findById(id: number): Promise<DocumentEntity | null>;

  save(document: DocumentEntity): Promise<DocumentEntity>;

  exists(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<boolean>;

  findByOwner(
    ownerId: number,
    ownerType: DocumentOwnerType,
  ): Promise<DocumentEntity[]>;

  findByOwnerAndType(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<DocumentEntity | null>;

  findByOwnerAndStatus(
    ownerId: number,
    ownerType: DocumentOwnerType,
    status: DocumentStatus,
  ): Promise<DocumentEntity[]>;

  findByStatus(status: DocumentStatus): Promise<DocumentEntity[]>;
}
