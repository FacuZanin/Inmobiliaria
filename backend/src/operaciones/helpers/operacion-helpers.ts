import { Operacion } from '../entities/operacion.entity';
import { OperacionEstado } from '../../common/enums/operacion-estado.enum';

export function puedeFinalizar(op: Operacion): boolean {
  return op.estado === OperacionEstado.EN_PROCESO;
}

export function finalizarOperacionHelper(op: Operacion): Operacion {
  if (!puedeFinalizar(op)) {
    throw new Error('La operación no puede finalizarse desde el estado actual.');
  }

  op.estado = OperacionEstado.FINALIZADA;
  op.fechaFinalizacion = new Date();
  return op;
}

export function reservarOperacionHelper(op: Operacion, fecha: Date): Operacion {
  if (op.estado !== OperacionEstado.PENDIENTE) {
    throw new Error('Solo operaciones pendientes pueden reservarse.');
  }
  op.fechaReserva = fecha;
  op.estado = OperacionEstado.RESERVADA;
  return op;
}
