// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\document.typeorm.repository.ts
import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentType } from '@/modules/documents/domain/enums/document-type.enum';

import { DocumentOrmEntity } from '../entities/document.orm-entity';

import { DocumentMapper } from '@/modules/documents/infrastructure/mappers/document.mapper';

@Injectable()
export class DocumentTypeOrmRepository
  implements DocumentRepositoryPort
{
  constructor(
    private readonly manager: EntityManager,
  ) {}

  async findById(
    id: number,
  ): Promise<DocumentEntity | null> {
    const document =
      await this.manager.findOne(
        DocumentOrmEntity,
        {
          where: { id },
        },
      );

    return document
      ? DocumentMapper.toDomain(document)
      : null;
  }

  async save(
    document: DocumentEntity,
  ): Promise<DocumentEntity> {
    const ormEntity =
      DocumentMapper.toOrm(document);

    const saved =
      await this.manager.save(
        DocumentOrmEntity,
        ormEntity,
      );

    return DocumentMapper.toDomain(saved);
  }

  async findByOwnerAndType(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<DocumentEntity | null> {
    const document =
      await this.manager.findOne(
        DocumentOrmEntity,
        {
          where: {
            ownerId,
            ownerType,
            type,
          },
        },
      );

    return document
      ? DocumentMapper.toDomain(document)
      : null;
  }

  async exists(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<boolean> {
    return this.manager.exists(
      DocumentOrmEntity,
      {
        where: {
          ownerId,
          ownerType,
          type,
        },
      },
    );
  }
}