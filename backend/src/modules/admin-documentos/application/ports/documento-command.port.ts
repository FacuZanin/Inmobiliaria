// backend\src\modules\admin-documentos\application\ports\documento-command.port.ts
import { DocumentoEstado } from '@shared/enums/documento-estado.enum';

export const DOCUMENTO_COMMAND_PORT = 'DOCUMENTO_COMMAND_PORT';

export interface DocumentoCommandPort {
  cambiarEstado(
    tipo: 'INQUILINO' | 'PROPIETARIO',
    id: number,
    estado: DocumentoEstado,
    comentario?: string | null,
  ): Promise<any>;
}
