// backend\src\modules\propietario-documentos\domain\entities\propietario-documento.model.ts

import { Owner } from './owner';
import { DocumentoEstado } from '@shared/enums/documento-estado.enum';
import { TipoDocumentoPropietario } from '@shared/enums/tipo-documento-propietario.enum';
export class PropietarioDocumentoModel {
  constructor(
    public id: number | null,
    public propietario: Owner,
    public propiedadId: number | null,
    public tipoDocumento: TipoDocumentoPropietario,
    public archivoUrl: string,
    public estado: DocumentoEstado,
    public comentarioRechazo: string | null,
    public fechaSubida?: Date,
  ) {}
}
