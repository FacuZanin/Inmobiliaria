// backend\src\modules\documents\application\dto\update-document-status.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

export class UpdateDocumentStatusDto {
  @IsEnum(DocumentStatus)
  status!: DocumentStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
