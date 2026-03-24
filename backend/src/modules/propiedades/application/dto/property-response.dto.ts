// backend\src\modules\propiedades\application\dto\property-response.dto.ts

import type { PropertyAggregate } from '../../domain/entities/property.aggregate';

export class PropertyResponseMapper {
  static toResponse(p: PropertyAggregate) {
    return {
      id: p.id,
      titulo: p.titulo,
      descripcion: p.descripcion,
      tipo: p.tipo,
      operacion: p.operacion,
      precio: p.precio,

      direccion: p.direccion,
      localidad: p.localidad,

      ambientes: p.ambientes,
      dormitorios: p.dormitorios,
      banos: p.banos,

      metrosCubiertos: p.superficie?.metrosCubiertos ?? null,
      metrosTotales: p.superficie?.metrosTotales ?? null,

      imagenes: p.imagenes,
      agenciaId: p.agenciaId,
      creadoPorId: p.creadoPorId,
      activo: p.activo,
      creadoEn: p.creadoEn,
      detalles: p.detalles ?? {},
    };
  }
}
