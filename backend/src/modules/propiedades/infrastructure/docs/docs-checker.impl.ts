// backend\src\modules\propiedades\infrastructure\docs\docs-checker.impl.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import type { DocsCheckerPort } from '../../application/ports/docs-checker.port';
import { DocumentosAprobadosPropietarioUseCase } 
from '../../../propietario-documentos/application/use-cases/documentos-aprobados.usecase';


@Injectable()
export class DocsCheckerImpl implements DocsCheckerPort {
  constructor(
    private readonly docService: DocumentosAprobadosPropietarioUseCase,
  ) {}

  async hasApprovedDocs(ownerId: number): Promise<{
    dni: boolean;
    escritura: boolean;
  }> {
    const docs = await this.docService.execute(ownerId);

    const dni = docs.some(
      d =>
        d.tipoDocumento === TipoDocumentoPropietario.DNI_FRENTE ||
        d.tipoDocumento === TipoDocumentoPropietario.DNI_DORSO,
    );

    const escritura = docs.some(
      d => d.tipoDocumento === TipoDocumentoPropietario.ESCRITURA,
    );

    return { dni, escritura };
  }

  async validateOwnerDocuments(ownerId: number): Promise<void> {
    const { dni, escritura } = await this.hasApprovedDocs(ownerId);

    if (!dni || !escritura) {
      throw new BadRequestException(
        'Para publicar una propiedad necesitás tener documentos verificados: DNI + Escritura.',
      );
    }
  }
}
