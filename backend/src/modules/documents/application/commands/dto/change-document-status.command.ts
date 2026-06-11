// backend\src\modules\documents\application\commands\dto\change-document-status.command.ts
import { DocumentStatus } from '../../../domain/enums/document-status.enum';

export interface ChangeDocumentStatusCommand {
  documentId: number;
  status: DocumentStatus;
  adminId: number;
  rejectionReason?: string;
}