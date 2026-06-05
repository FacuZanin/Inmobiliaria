// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\document.typeorm.repository.ts
import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { PaginatedResponseDto } from '@/core/application/dto/paginated-response.dto';

import {
  FindDocumentsByOwnerParams,
  FindDocumentsByStatusParams,
} from '@/modules/documents/domain/repositories/document.repository.port';
import { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentType } from '@/modules/documents/domain/enums/document-type.enum';

import { DocumentOrmEntity } from '../entities/document.orm-entity';

import { DocumentMapper } from '@/modules/documents/infrastructure/mappers/document.mapper';

@Injectable()
export class DocumentTypeOrmRepository implements DocumentRepositoryPort {
  constructor(private readonly manager: EntityManager) {}

  async findById(id: number): Promise<DocumentEntity | null> {
    const document = await this.manager.findOne(DocumentOrmEntity, {
      where: { id },
    });

    return document ? DocumentMapper.toDomain(document) : null;
  }

  async save(document: DocumentEntity): Promise<DocumentEntity> {
    const ormEntity = DocumentMapper.toOrm(document);

    const saved = await this.manager.save(DocumentOrmEntity, ormEntity);

    return DocumentMapper.toDomain(saved);
  }

  async findByOwner(
    params: FindDocumentsByOwnerParams,
  ): Promise<PaginatedResponseDto<DocumentEntity>> {
    const { ownerId, ownerType, page, limit } = params;

    const [documents, total] = await this.manager.findAndCount(
      DocumentOrmEntity,
      {
        where: {
          ownerId,
          ownerType,
        },
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return new PaginatedResponseDto(
      documents.map(DocumentMapper.toDomain),
      total,
      page,
      limit,
    );
  }

  async findByOwnerAndType(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<DocumentEntity | null> {
    const document = await this.manager.findOne(DocumentOrmEntity, {
      where: {
        ownerId,
        ownerType,
        type,
      },
    });

    return document ? DocumentMapper.toDomain(document) : null;
  }

  async findByOwnerAndStatus(
    ownerId: number,
    ownerType: DocumentOwnerType,
    status: DocumentStatus,
  ): Promise<DocumentEntity[]> {
    const documents = await this.manager.find(DocumentOrmEntity, {
      where: {
        ownerId,
        ownerType,
        status,
      },
    });

    return documents.map((document) => DocumentMapper.toDomain(document));
  }

  async exists(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<boolean> {
    return this.manager.exists(DocumentOrmEntity, {
      where: {
        ownerId,
        ownerType,
        type,
      },
    });
  }

  async findByStatus(
    params: FindDocumentsByStatusParams,
  ): Promise<PaginatedResponseDto<DocumentEntity>> {
    const { status, page, limit } = params;

    const [documents, total] = await this.manager.findAndCount(
      DocumentOrmEntity,
      {
        where: {
          status,
        },
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return new PaginatedResponseDto(
      documents.map(DocumentMapper.toDomain),
      total,
      page,
      limit,
    );
  }
}
