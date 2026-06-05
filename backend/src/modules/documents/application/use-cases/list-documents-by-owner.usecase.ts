// backend\src\modules\documents\application\use-cases\list-documents-by-owner.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENT_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import type { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

@Injectable()
export class ListDocumentsByOwnerUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentsRepository: DocumentRepositoryPort,
  ) {}

  async execute(params: {
    ownerId: number;
    ownerType: DocumentOwnerType;
    status?: DocumentStatus;
  }): Promise<DocumentEntity[]> {
    if (params.status) {
      return this.documentsRepository.findByOwnerAndStatus(
        params.ownerId,
        params.ownerType,
        params.status,
      );
    }

    return this.documentsRepository.findByOwner(
      params.ownerId,
      params.ownerType,
    );
  }
}
