// backend/src/modules/documents/domain/repositories/document.repository.port.ts

import { PaginatedResponseDto } from '@/core/application/dto/paginated-response.dto';

import { DocumentEntity } from '../entities/document.entity';

import { DocumentOwnerType } from '../enums/document-owner-type.enum';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export interface FindDocumentsByStatusParams {
  status: DocumentStatus;
  page: number;
  limit: number;
}

export interface FindDocumentsByOwnerParams {
  ownerId: number;
  ownerType: DocumentOwnerType;
  page: number;
  limit: number;
}

export interface DocumentRepositoryPort {
  findById(id: number): Promise<DocumentEntity | null>;

  save(document: DocumentEntity): Promise<DocumentEntity>;

  exists(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<boolean>;

  findByOwner(
    params: FindDocumentsByOwnerParams,
  ): Promise<PaginatedResponseDto<DocumentEntity>>;

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

  findByStatus(
    params: FindDocumentsByStatusParams,
  ): Promise<PaginatedResponseDto<DocumentEntity>>;

  pullDomainEvents?(): unknown[];
}