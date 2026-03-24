// backend\src\modules\propiedades\domain\services\document-verifier.ts
import { DocsCheckerPort } from '../../application/ports/docs-checker.port';

export class DocumentVerifier {
  constructor(private readonly checker: DocsCheckerPort) {}

  async validateOwnerDocuments(ownerId: number) {
    const docs = await this.checker.hasApprovedDocs(ownerId);

    return {
      isValid: docs.dni && docs.escritura,
      details: docs,
    };
  }
}
