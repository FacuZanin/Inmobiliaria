// backend/src/modules/documents/application/use-cases/upload-document.usecase.ts

import { Inject, Injectable } from '@nestjs/common';

import { Express } from 'express';

import { FILE_STORAGE } from '@/modules/documents/application/tokens/storage.tokens';

import { DOCUMENTS_UNIT_OF_WORK } from '@/modules/documents/application/tokens/document.tokens';

import type { FileStoragePort } from '@/modules/documents/application/ports/file-storage.port';
import type { DocumentsUnitOfWorkPort } from '@/modules/documents/application/ports/unit-of-work.port';

import { UploadDocumentDto } from '@/modules/documents/application/dto/upload-document.dto';

import { DocumentAuditEntity } from '@/modules/documents/domain/entities/document-audit.entity';
import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';
import { DocumentOwnerEntity } from '@/modules/documents/domain/entities/document-owner.entity';

import { DocumentAuditAction } from '@/modules/documents/domain/enums/document-audit-action.enum';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

import { InvalidDocumentFileException } from '@/modules/documents/domain/exceptions/invalid-document-file.exception';

@Injectable()
export class UploadDocumentUseCase {
  private static readonly ALLOWED_MIME_TYPES =
    new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]);

  constructor(
    @Inject(DOCUMENTS_UNIT_OF_WORK)
    private readonly uow: DocumentsUnitOfWorkPort,

    @Inject(FILE_STORAGE)
    private readonly storage: FileStoragePort,
  ) {}

  async execute(params: {
    ownerId: number;
    ownerType: DocumentOwnerType;
    dto: UploadDocumentDto;
    file: Express.Multer.File;
  }): Promise<DocumentEntity> {
    const {
      ownerId,
      ownerType,
      dto,
      file,
    } = params;

    this.ensureValidFile(file);

    const fileUrl =
      await this.storage.save(file);

    return this.uow.execute(
      async ({ documents, audits }) => {
        const existing =
          await documents.findByOwnerAndType(
            ownerId,
            ownerType,
            dto.type,
          );

        if (existing) {
          const oldUrl = existing.fileUrl;

          existing.replaceFile(fileUrl);

          const updated =
            await documents.save(existing);

          await audits.save(
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

        const document =
          DocumentEntity.create({
            owner: new DocumentOwnerEntity(
              ownerId,
              ownerType,
            ),

            type: dto.type,

            fileUrl,
          });

        const created =
          await documents.save(document);

        await audits.save(
          new DocumentAuditEntity(
            null,
            created.id!,
            DocumentAuditAction.CREATED,
            ownerId,
            null,
          ),
        );

        return created;
      },
    );
  }

  private ensureValidFile(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new InvalidDocumentFileException(
        'Document file is required.',
      );
    }

    if (
      !UploadDocumentUseCase.ALLOWED_MIME_TYPES.has(
        file.mimetype,
      )
    ) {
      throw new InvalidDocumentFileException(
        `Unsupported document mime type: ${file.mimetype}`,
      );
    }
  }
}