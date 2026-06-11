// backend\src\modules\documents\domain\repositories\document.repository.port.ts

import { DocumentEntity } from '../entities/document.entity';

import { DocumentOwnerType } from '../enums/document-owner-type.enum';
import { DocumentType } from '../enums/document-type.enum';

export interface DocumentRepositoryPort {
  findById(id: number): Promise<DocumentEntity | null>;

  save(document: DocumentEntity): Promise<DocumentEntity>;

  exists(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<boolean>;

  findByOwnerAndType(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<DocumentEntity | null>;

  pullDomainEvents?(): unknown[];
}