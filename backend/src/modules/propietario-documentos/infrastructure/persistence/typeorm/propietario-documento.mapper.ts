// backend\src\modules\propietario-documentos\infrastructure\persistence\typeorm\propietario-documento.mapper.ts
import { PropietarioDocumentoModel } from '../../../domain/entities/propietario-documento.model';
import { Owner } from '../../../domain/entities/owner';
import { PropietarioDocumento as PropietarioDocumentoOrm } from '../../../domain/entities/propietario-documento.domain';
import { DocumentoEstado } from '@shared/contracts';

export const toDomain = (e: PropietarioDocumentoOrm): PropietarioDocumentoModel => {
  const owner = new Owner(
    e.propietario?.id ?? null,
    (e.propietario as any)?.nombre ?? null,
    (e.propietario as any)?.email ?? null,
  );

  return new PropietarioDocumentoModel(
    e.id ?? null,
    owner,
    e.propiedadId ?? null,
    e.tipoDocumento as any,
    e.archivoUrl,
    e.estado ?? DocumentoEstado.PENDIENTE,
    e.comentarioRechazo ?? null,
    e.fechaSubida ?? undefined,
  );
};


export const toOrmPartial = (d: PropietarioDocumentoModel): Partial<PropietarioDocumentoOrm> => {
  return {
    id: d.id ?? undefined,
    propietario: d.propietario?.id ? ({ id: d.propietario.id } as any) : undefined,
    propiedad: d.propiedadId ? ({ id: d.propiedadId } as any) : undefined,
    tipoDocumento: d.tipoDocumento as any,
    archivoUrl: d.archivoUrl,
    estado: d.estado,
    comentarioRechazo: d.comentarioRechazo ?? null,
    fechaSubida: d.fechaSubida ?? undefined,
  } as Partial<PropietarioDocumentoOrm>;
};
