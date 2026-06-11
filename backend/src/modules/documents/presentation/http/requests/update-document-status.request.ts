// backend\src\modules\documents\presentation\http\requests\update-document-status.request.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

export class UpdateDocumentStatusRequest {
  @IsEnum(DocumentStatus)
  status!: DocumentStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}