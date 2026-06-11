// backend\src\modules\documents\presentation\http\mappers\upload-document-request.mapper.ts
import { Express } from 'express';

import { UploadDocumentRequest } from '@/modules/documents/presentation/http/requests/upload-document.request';

import { UploadDocumentCommand } from '@/modules/documents/application/commands/dto/upload-document.command';

import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

export class UploadDocumentRequestMapper {
  static toCommand(params: {
    ownerId: number;
    ownerType: DocumentOwnerType;
    request: UploadDocumentRequest;
    file: Express.Multer.File;
  }): UploadDocumentCommand {
    const {
      ownerId,
      ownerType,
      request,
      file,
    } = params;

    return {
      ownerId,

      ownerType,

      type: request.type,

      file: {
        originalName:
          file.originalname,

        mimeType:
          file.mimetype,

        buffer: file.buffer,

        size: file.size,
      },
    };
  }
}