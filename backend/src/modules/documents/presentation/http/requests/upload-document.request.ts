// backend\src\modules\documents\presentation\http\requests\upload-document.request.ts
import { IsEnum } from 'class-validator';

import { DocumentType } from '@/modules/documents/domain/enums/document-type.enum';

export class UploadDocumentRequest {
  @IsEnum(DocumentType)
  type!: DocumentType;
}