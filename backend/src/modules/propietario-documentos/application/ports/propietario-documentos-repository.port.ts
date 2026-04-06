// backend\src\modules\propietario-documentos\application\ports\propietario-documentos-repository.port.ts
import type { PropietarioDocumentoModel } from '../../domain/entities/propietario-documento.model';
import type { Owner } from '../../domain/entities/owner';
import { TipoDocumentoPropietario } from '@shared/enums/tipo-documento-propietario.enum';

export interface PropietarioDocumentosRepositoryPort {
  findOwnerById(ownerId: number): Promise<Owner | null>;

  findDocumentoByPropietarioAndTipo(
    propietarioId: number,
    tipo: TipoDocumentoPropietario,
  ): Promise<PropietarioDocumentoModel | null>;

  findById(id: number): Promise<PropietarioDocumentoModel | null>;

  saveDocumento(doc: Partial<PropietarioDocumentoModel>): Promise<PropietarioDocumentoModel>;

  listByPropietario(propietarioId: number): Promise<PropietarioDocumentoModel[]>;

  findAprobadosByPropietario(propietarioId: number): Promise<PropietarioDocumentoModel[]>;
}