// backend\src\modules\documents\application\commands\handlers\upload-document.handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { FILE_STORAGE } from '../../tokens/storage.tokens';

import { DOCUMENTS_UNIT_OF_WORK } from '../../tokens/document.tokens';

import type { FileStoragePort } from '../../ports/file-storage.port';
import type { DocumentsUnitOfWorkPort } from '../../ports/unit-of-work.port';

import type { CommandHandler } from '@modules/documents/application/commands/contracts/command-handler.contract';

import type { UploadDocumentCommand } from '@modules/documents/application/commands/dto/upload-document.command';

import { DocumentAuditEntity } from '../../../domain/entities/document-audit.entity';
import { DocumentEntity } from '../../../domain/entities/document.entity';
import { DocumentOwnerEntity } from '../../../domain/entities/document-owner.entity';

import { DocumentAuditAction } from '../../../domain/enums/document-audit-action.enum';

import { InvalidDocumentFileException } from '../../../domain/exceptions/invalid-document-file.exception';

@Injectable()
export class UploadDocumentHandler
  implements
    CommandHandler<
      UploadDocumentCommand,
      DocumentEntity
    >
{
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

  async execute(
    command: UploadDocumentCommand,
  ): Promise<DocumentEntity> {
    this.ensureValidFile(command);

    const fileUrl =
      await this.storage.save({
        originalName:
          command.file.originalName,

        mimeType:
          command.file.mimeType,

        buffer: command.file.buffer,
      });

    return this.uow.execute(
      async ({ documents, audits }) => {
        const existing =
          await documents.findByOwnerAndType(
            command.ownerId,
            command.ownerType,
            command.type,
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
              command.ownerId,
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
              command.ownerId,
              command.ownerType,
            ),

            type: command.type,

            fileUrl,
          });

        const created =
          await documents.save(document);

        await audits.save(
          new DocumentAuditEntity(
            null,
            created.id!,
            DocumentAuditAction.CREATED,
            command.ownerId,
            null,
          ),
        );

        return created;
      },
    );
  }

  private ensureValidFile(
    command: UploadDocumentCommand,
  ): void {
    if (!command.file) {
      throw new InvalidDocumentFileException(
        'Document file is required.',
      );
    }

    if (
      !UploadDocumentHandler.ALLOWED_MIME_TYPES.has(
        command.file.mimeType,
      )
    ) {
      throw new InvalidDocumentFileException(
        `Unsupported document mime type: ${command.file.mimeType}`,
      );
    }
  }
}