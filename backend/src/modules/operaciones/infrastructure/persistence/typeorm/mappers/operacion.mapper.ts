// backend\src\modules\operaciones\infrastructure\persistence\typeorm\mappers\operacion.mapper.ts
import { Operacion } from '../entities/operacion.entity';
import { OperacionAggregate } from '../../../../domain/entities/operacion.aggregate';

export class OperacionMapper {
  // ORM -> DOMAIN
  static toDomain(entity: Operacion): OperacionAggregate {
    return OperacionAggregate.rehydrate({
      id: entity.id,
      tipo: entity.tipo,
      estado: entity.estado,
      medio: entity.medio ?? null,

      propiedadId: entity.propiedad.id,
      agenciaId: entity.agencia?.id ?? null,
      propietarioDirectoId: entity.propietarioDirecto?.id ?? null,
      creadoPorId: entity.creadoPor.id,
      compradorInquilinoId: entity.compradorInquilino?.id ?? null,

      fechaReserva: entity.fechaReserva ?? null,
      fechaFinalizacion: entity.fechaFinalizacion ?? null,
      observaciones: entity.observaciones ?? null,

      creadoEn: entity.creadoEn,
    });
  }

  // DOMAIN -> ORM (solo lo mutable)
  static toOrm(
    aggregate: OperacionAggregate,
    entity: Operacion,
  ): Operacion {
    entity.tipo = aggregate.tipo;
    entity.estado = aggregate.estado;
    entity.medio = aggregate.medio;

    entity.fechaReserva = aggregate.fechaReserva;
    entity.fechaFinalizacion = aggregate.fechaFinalizacion;
    entity.observaciones = aggregate.observaciones;

    return entity;
  }
}
