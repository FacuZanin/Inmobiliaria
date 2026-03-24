// backend\src\modules\admin-documentos\application\ports\documento-query.port.ts
import { FiltroDocumentosDto } from '../dto/filtro-documentos.dto';

export const DOCUMENTO_QUERY_PORT = 'DOCUMENTO_QUERY_PORT';

export interface DocumentoQueryPort {
  listar(filtros: FiltroDocumentosDto): Promise<{
    total: number;
    docs: any[];
  }>;
}
