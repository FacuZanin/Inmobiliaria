// backend\src\modules\propiedades\application\ports\docs-checker.port.ts
export interface DocsCheckerPort {
  hasApprovedDocs(ownerId: number): Promise<{
    dni: boolean;
    escritura: boolean;
  }>;

  validateOwnerDocuments(ownerId: number): Promise<void>;
}
