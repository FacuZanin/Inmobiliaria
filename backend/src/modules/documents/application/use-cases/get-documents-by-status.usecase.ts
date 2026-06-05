import { Inject, Injectable } from '@nestjs/common';

import { DOCUMENT_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';

import type { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';

import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';

@Injectable()
export class GetDocumentsByStatusUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentsRepository: DocumentRepositoryPort,
  ) {}

  async execute(status: DocumentStatus): Promise<DocumentEntity[]> {
    return this.documentsRepository.findByStatus(status);
  }
}
