// backend\src\modules\users\application\dto\upload-document.dto.ts
import { IsEnum } from 'class-validator';

import { DocumentType } from '@modules/documents/domain/enums/document-type.enum';

export class UploadDocumentDto {
  @IsEnum(DocumentType)
  type!: DocumentType;
}
