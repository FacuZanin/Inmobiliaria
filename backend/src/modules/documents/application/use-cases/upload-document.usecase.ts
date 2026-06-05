import { Inject, Injectable } from '@nestjs/common';

import { Express } from 'express';

import {
  DOCUMENT_AUDIT_REPOSITORY,
  DOCUMENT_REPOSITORY,
} from '@/modules/documents/application/tokens/document.tokens';
import { FILE_STORAGE } from '@/modules/documents/application/tokens/storage.tokens';

import type { FileStoragePort } from '@/modules/documents/application/ports/file-storage.port';
import type { DocumentAuditRepositoryPort } from '@/modules/documents/domain/repositories/document-audit.repository.port';
import type { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { UploadDocumentDto } from '@/modules/documents/application/dto/upload-document.dto';

import { DocumentAuditEntity } from '@/modules/documents/domain/entities/document-audit.entity';
import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';
import { DocumentOwnerEntity } from '@/modules/documents/domain/entities/document-owner.entity';

import { DocumentAuditAction } from '@/modules/documents/domain/enums/document-audit-action.enum';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

import { InvalidDocumentFileException } from '@/modules/documents/domain/exceptions/invalid-document-file.exception';

@Injectable()
export class UploadDocumentUseCase {
  private static readonly ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
  ]);

  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentsRepository: DocumentRepositoryPort,

    @Inject(DOCUMENT_AUDIT_REPOSITORY)
    private readonly auditRepository: DocumentAuditRepositoryPort,

    @Inject(FILE_STORAGE)
    private readonly storage: FileStoragePort,
  ) {}

  async execute(params: {
    ownerId: number;
    ownerType: DocumentOwnerType;
    dto: UploadDocumentDto;
    file: Express.Multer.File;
  }): Promise<DocumentEntity> {
    const { ownerId, ownerType, dto, file } = params;

    this.ensureValidFile(file);

    const existing = await this.documentsRepository.findByOwnerAndType(
      ownerId,
      ownerType,
      dto.type,
    );

    const fileUrl = await this.storage.save(file);

    if (existing) {
      const oldUrl = existing.fileUrl;

      existing.replaceFile(fileUrl);

      const updated = await this.documentsRepository.save(existing);

      await this.auditRepository.save(
        new DocumentAuditEntity(
          null,
          updated.id!,
          DocumentAuditAction.REPLACED,
          ownerId,
          {
            oldUrl,
            newUrl: fileUrl,
          },
        ),
      );

      return updated;
    }

    const document = DocumentEntity.create({
      owner: new DocumentOwnerEntity(ownerId, ownerType),
      type: dto.type,
      fileUrl,
    });

    const created = await this.documentsRepository.save(document);

    await this.auditRepository.save(
      new DocumentAuditEntity(
        null,
        created.id!,
        DocumentAuditAction.CREATED,
        ownerId,
        null,
      ),
    );

    return created;
  }

  private ensureValidFile(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new InvalidDocumentFileException('Document file is required.');
    }

    if (!UploadDocumentUseCase.ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new InvalidDocumentFileException(
        `Unsupported document mime type: ${file.mimetype}`,
      );
    }
  }
}
