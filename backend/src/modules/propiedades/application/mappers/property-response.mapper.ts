// backend\src\modules\propiedades\application\mappers\property-response.mapper.ts
import type { PropertyAggregate } from '../../domain/entities/property.aggregate';

import { PropertyResponseDto } from '../dto/property-response.dto';

export class PropertyResponseMapper {
  static toResponse(
    p: PropertyAggregate,
  ): PropertyResponseDto {
    return {
      id: p.id,

      titulo: p.titulo,
      descripcion: p.descripcion,

      tipo: p.tipo,
      operacion: p.operacion,

      precio: p.precio,

      direccion: p.direccion?.toString() ?? null,
      localidad: p.localidad,

      ambientes: p.ambientes,
      dormitorios: p.dormitorios,
      banos: p.banos,

      metrosCubiertos:
        p.superficie?.metrosCubiertos ?? null,

      metrosTotales:
        p.superficie?.metrosTotales ?? null,

      imagenes: p.imagenes,

      agenciaId: p.agenciaId,

      creadoPorId: p.creadoPorId,

      status: p.status,

      moderationStatus: p.moderationStatus,

      activo: p.activo,

      detalles: p.detalles ?? {},
    };
  }
}