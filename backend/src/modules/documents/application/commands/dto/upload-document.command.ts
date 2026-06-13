// backend/src/modules/documents/application/commands/dto/upload-document.command.ts
import { DocumentOwnerType } from '../../../domain/enums/document-owner-type.enum';
import { DocumentType } from '../../../domain/enums/document-type.enum';

export interface UploadDocumentCommand {
  ownerId: number;
  ownerType: DocumentOwnerType;

  type: DocumentType;

  file: {
    originalName: string;
    mimeType: string;
    buffer: Buffer;
    size: number;
  };
}
