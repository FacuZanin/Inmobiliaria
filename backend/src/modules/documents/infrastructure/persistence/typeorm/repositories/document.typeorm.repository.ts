// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\document.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentType } from '@/modules/documents/domain/enums/document-type.enum';

import { DocumentOrmEntity } from '../entities/document.orm-entity';

import { DocumentMapper } from '@/modules/documents/infrastructure/mappers/document.mapper';

@Injectable()
export class DocumentTypeOrmRepository implements DocumentRepositoryPort {
  constructor(
    @InjectRepository(DocumentOrmEntity)
    private readonly repository: Repository<DocumentOrmEntity>,
  ) {}

  async findById(id: number): Promise<DocumentEntity | null> {
    const document = await this.repository.findOne({
      where: { id },
    });

    return document ? DocumentMapper.toDomain(document) : null;
  }

  async save(document: DocumentEntity): Promise<DocumentEntity> {
    const ormEntity = DocumentMapper.toOrm(document);

    const saved = await this.repository.save(ormEntity);

    return DocumentMapper.toDomain(saved);
  }

  async findByOwner(
    ownerId: number,
    ownerType: DocumentOwnerType,
  ): Promise<DocumentEntity[]> {
    const documents = await this.repository.find({
      where: {
        ownerId,
        ownerType,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return documents.map(DocumentMapper.toDomain);
  }

  async findByOwnerAndType(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<DocumentEntity | null> {
    const document = await this.repository.findOne({
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
    const documents = await this.repository.find({
      where: {
        ownerId,
        ownerType,
        status,
      },
    });

    return documents.map(DocumentMapper.toDomain);
  }

  async exists(
    ownerId: number,
    ownerType: DocumentOwnerType,
    type: DocumentType,
  ): Promise<boolean> {
    return this.repository.exists({
      where: {
        ownerId,
        ownerType,
        type,
      },
    });
  }

  async findByStatus(status: DocumentStatus): Promise<DocumentEntity[]> {
    const documents = await this.repository.find({
      where: {
        status,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return documents.map(DocumentMapper.toDomain);
  }
}
