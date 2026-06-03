// backend\src\modules\admin-documentos\application\use-cases\listar-documentos.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENTO_QUERY_PORT } from '../ports/documento-query.port';
import type { DocumentoQueryPort } from '../ports/documento-query.port';

import type { FiltroDocumentosDto } from '../dto/filtro-documentos.dto';

@Injectable()
export class ListarDocumentosUseCase {
  constructor(
    @Inject(DOCUMENTO_QUERY_PORT)
    private readonly documentoQuery: DocumentoQueryPort,
  ) {}

  execute(filtros: FiltroDocumentosDto) {
    return this.documentoQuery.listar(filtros);
  }
}
