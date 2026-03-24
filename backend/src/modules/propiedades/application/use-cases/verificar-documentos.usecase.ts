// backend\src\modules\propiedades\application\use-cases\verificar-documentos.usecase.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DOCS_CHECKER } from '../tokens';
import type { DocsCheckerPort } from '../ports/docs-checker.port';

@Injectable()
export class VerificarDocumentosUseCase {
  constructor(
    @Inject(DOCS_CHECKER)
    private readonly docsChecker: DocsCheckerPort,
  ) {}

  async execute(ownerId: number): Promise<void> {
    await this.docsChecker.validateOwnerDocuments(ownerId);
  }
}
