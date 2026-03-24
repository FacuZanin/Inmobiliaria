// backend\src\modules\propietario-documentos\domain\entities\propietario-documento.model.ts

import { Owner } from './owner';
import { DocumentoEstado } from '@shared/contracts';
import { TipoDocumentoPropietario } from './propietario-documento.domain';

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
