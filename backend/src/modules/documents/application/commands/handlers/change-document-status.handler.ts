// backend/src/modules/documents/application/commands/handlers/change-document-status.handler.ts
import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENTS_UNIT_OF_WORK } from '../../tokens/document.tokens';

import type { DocumentsUnitOfWorkPort } from '../../ports/unit-of-work.port';

import type { CommandHandler } from '../contracts/command-handler.contract';

import type { ChangeDocumentStatusCommand } from '../dto/change-document-status.command';

import { DocumentAuditEntity } from '../../../domain/entities/document-audit.entity';
import { DocumentEntity } from '../../../domain/entities/document.entity';

import { DocumentAuditAction } from '../../../domain/enums/document-audit-action.enum';
import { DocumentStatus } from '../../../domain/enums/document-status.enum';

import { DocumentNotFoundException } from '../../../domain/exceptions/document-not-found.exception';
import { InvalidDocumentStatusException } from '../../../domain/exceptions/invalid-document-status.exception';

@Injectable()
export class ChangeDocumentStatusHandler
  implements
    CommandHandler<
      ChangeDocumentStatusCommand,
      DocumentEntity
    >
{
  constructor(
    @Inject(DOCUMENTS_UNIT_OF_WORK)
    private readonly uow: DocumentsUnitOfWorkPort,
  ) {}

  async execute(
    command: ChangeDocumentStatusCommand,
  ): Promise<DocumentEntity> {
    return this.uow.execute(
      async ({ documents, audits }) => {
        const document =
          await documents.findById(
            command.documentId,
          );

        if (!document) {
          throw new DocumentNotFoundException(
            command.documentId,
          );
        }

        const rejectionReason =
          command.rejectionReason?.trim();

        switch (command.status) {
          case DocumentStatus.APPROVED:
            document.approve(command.adminId);
            break;

          case DocumentStatus.REJECTED:
            if (!rejectionReason) {
              throw new InvalidDocumentStatusException(
                'Rejected documents require a rejection reason.',
              );
            }

            document.reject(
              command.adminId,
              rejectionReason,
            );

            break;

          case DocumentStatus.UNDER_REVIEW:
            document.markUnderReview();
            break;

          default:
            throw new InvalidDocumentStatusException(
              `Unsupported document status transition: ${command.status}`,
            );
        }

        const saved =
          await documents.save(document);

        await audits.save(
          new DocumentAuditEntity(
            null,
            saved.id!,
            this.resolveAuditAction(
              command.status,
            ),
            command.adminId,
            {
              rejectionReason:
                rejectionReason ?? null,
            },
          ),
        );

        return saved;
      },
    );
  }

  private resolveAuditAction(
    status: DocumentStatus,
  ): DocumentAuditAction {
    const actions: Partial<
      Record<
        DocumentStatus,
        DocumentAuditAction
      >
    > = {
      [DocumentStatus.APPROVED]:
        DocumentAuditAction.APPROVED,

      [DocumentStatus.REJECTED]:
        DocumentAuditAction.REJECTED,

      [DocumentStatus.UNDER_REVIEW]:
        DocumentAuditAction.UNDER_REVIEW,
    };

    const action = actions[status];

    if (!action) {
      throw new InvalidDocumentStatusException(
        `Unsupported document audit action: ${status}`,
      );
    }

    return action;
  }
}