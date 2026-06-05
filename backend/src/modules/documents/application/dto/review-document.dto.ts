// backend\src\modules\documents\application\dto\review-document.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DocumentStatus } from '../../domain/enums/document-status.enum';

export class ReviewDocumentDto {
  @IsEnum(DocumentStatus)
  status!: DocumentStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
