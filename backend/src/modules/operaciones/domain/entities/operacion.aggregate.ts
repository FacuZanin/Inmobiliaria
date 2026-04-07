// backend\src\modules\operaciones\domain\entities\operacion.aggregate.ts
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { OperacionEstado } from '@shared/contracts/enums/operacion-estado.enum';
import { MedioOperacion } from '@shared/contracts/enums/medio-operacion.enum';

type OperacionProps = {
  id?: number | null;
  tipo: OperacionTipo;
  estado?: OperacionEstado;
  medio?: MedioOperacion | null;

  propiedadId: number;
  agenciaId?: number | null;
  propietarioDirectoId?: number | null;
  creadoPorId: number;
  compradorInquilinoId?: number | null;

  fechaReserva?: Date | null;
  fechaFinalizacion?: Date | null;
  observaciones?: string | null;

  creadoEn?: Date;
};

export class OperacionAggregate {
  private _id: number | null;
  private _tipo: OperacionTipo;
  private _estado: OperacionEstado;
  private _medio: MedioOperacion | null;

  private _propiedadId: number;
  private _agenciaId: number | null;
  private _propietarioDirectoId: number | null;
  private _creadoPorId: number;
  private _compradorInquilinoId: number | null;

  private _fechaReserva: Date | null;
  private _fechaFinalizacion: Date | null;
  private _observaciones: string | null;

  private _creadoEn?: Date;

  private constructor(props: OperacionProps) {
    this._id = props.id ?? null;
    this._tipo = props.tipo;
    this._estado = props.estado ?? OperacionEstado.PENDIENTE;
    this._medio = props.medio ?? null;

    this._propiedadId = props.propiedadId;
    this._agenciaId = props.agenciaId ?? null;
    this._propietarioDirectoId = props.propietarioDirectoId ?? null;
    this._creadoPorId = props.creadoPorId;
    this._compradorInquilinoId = props.compradorInquilinoId ?? null;

    this._fechaReserva = props.fechaReserva ?? null;
    this._fechaFinalizacion = props.fechaFinalizacion ?? null;
    this._observaciones = props.observaciones ?? null;

    this._creadoEn = props.creadoEn;
  }

  // FACTORIES
  static create(props: Omit<OperacionProps, 'id' | 'estado' | 'creadoEn'>) {
    return new OperacionAggregate({
      ...props,
      estado: OperacionEstado.PENDIENTE,
      creadoEn: new Date(),
    });
  }

  static rehydrate(props: OperacionProps) {
    return new OperacionAggregate(props);
  }

  // DOMAIN RULES
  reservar(fecha: Date) {
    if (this._estado !== OperacionEstado.PENDIENTE) {
      throw new Error('Solo operaciones pendientes pueden reservarse');
    }
    this._estado = OperacionEstado.RESERVADA;
    this._fechaReserva = fecha;
  }

  procesar() {
    if (this._estado !== OperacionEstado.RESERVADA) {
      throw new Error('Solo operaciones reservadas pueden procesarse');
    }
    this._estado = OperacionEstado.EN_PROCESO;
  }

  finalizar() {
    if (this._estado !== OperacionEstado.EN_PROCESO) {
      throw new Error('La operación no puede finalizarse');
    }
    this._estado = OperacionEstado.FINALIZADA;
    this._fechaFinalizacion = new Date();
  }

  cancelar() {
    if (this._estado === OperacionEstado.FINALIZADA) {
      throw new Error('No se puede cancelar una operación finalizada');
    }
    this._estado = OperacionEstado.CANCELADA;
  }

  isFinalizada(): boolean {
  return this._estado === OperacionEstado.FINALIZADA;
}

isExpirada(): boolean {
  if (!this._fechaFinalizacion) return false;
  return this._fechaFinalizacion.getTime() < Date.now();
}

// GETTERS (solo lectura)

get id(): number | null {
  return this._id;
}

get tipo(): OperacionTipo {
  return this._tipo;
}

get estado(): OperacionEstado {
  return this._estado;
}

get medio(): MedioOperacion | null {
  return this._medio;
}

get propiedadId(): number {
  return this._propiedadId;
}

get agenciaId(): number | null {
  return this._agenciaId;
}

get propietarioDirectoId(): number | null {
  return this._propietarioDirectoId;
}

get creadoPorId(): number {
  return this._creadoPorId;
}

get compradorInquilinoId(): number | null {
  return this._compradorInquilinoId;
}

get fechaReserva(): Date | null {
  return this._fechaReserva;
}

get fechaFinalizacion(): Date | null {
  return this._fechaFinalizacion;
}

get observaciones(): string | null {
  return this._observaciones;
}

get creadoEn(): Date | undefined {
  return this._creadoEn;
}


}
