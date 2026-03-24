// backend\src\modules\propiedades\infrastructure\persistence\typeorm\mappers\property.mapper.ts

import { Propiedad } from '../entities/propiedad.entity';
import { PropiedadTipo, OperacionTipo} from '@shared/contracts';

import { PropertyAggregate } from '../../../../domain/entities/property.aggregate';
import { AddressVO } from '../../../../domain/value-objects/address.vo';
import { PriceVO } from '../../../../domain/value-objects/price.vo';
import { SuperficieVO } from '../../../../domain/value-objects/superficie.vo';

import { PropertyDetailsMapper } from './property-details.mapper';

export class PropertyMapper {
  // -------------------------------------------------
  // ORM → DOMAIN
  // -------------------------------------------------
  static toDomain(entity: Propiedad): PropertyAggregate {
    return PropertyAggregate.rehydrate({
      id: entity.id,
      titulo: entity.titulo,
      descripcion: entity.descripcion ?? null,
      tipo: entity.tipo,
      operacion: entity.operacion,

      precio: PriceVO.fromNumber(entity.precio),

      direccion: new AddressVO(entity.direccion),
      localidad: entity.localidad,

      imagenes: entity.imagenes ?? [],

      creadoPorId: entity.creadoPor?.id ?? null,
      activo: entity.activo,
      creadoEn: entity.creadoEn,

      ambientes: entity.ambientes ?? null,
      dormitorios: entity.dormitorios ?? null,
      banos: entity.banos ?? null,

      superficie:
        entity.metrosCubiertos != null || entity.metrosTotales != null
          ? new SuperficieVO(
              entity.metrosCubiertos ?? null,
              entity.metrosTotales ?? null,
            )
          : null,

      agenciaId: entity.agencia?.id ?? null,

      detalles: PropertyDetailsMapper.fromEntity(entity),
    });
  }

  // -------------------------------------------------
  // DOMAIN → ORM
  // -------------------------------------------------
  static toOrm(property: PropertyAggregate): Partial<Propiedad> {
    const superficie = property.superficie;

    return {
      id: property.id ?? undefined,

      titulo: property.titulo,
      descripcion: property.descripcion ?? undefined,

      tipo: property.tipo as PropiedadTipo,
      operacion: property.operacion as OperacionTipo,

      precio: property.precio ?? undefined,

      direccion: property.direccion.toString(),
      localidad: property.localidad,

      imagenes: property.imagenes.length ? property.imagenes : undefined,

      ambientes: property.ambientes ?? undefined,
      dormitorios: property.dormitorios ?? undefined,
      banos: property.banos ?? undefined,

      metrosCubiertos: superficie?.metrosCubiertos ?? undefined,
      metrosTotales: superficie?.metrosTotales ?? undefined,

      activo: property.activo,
      creadoEn: property.creadoEn,
    };
  }
}
