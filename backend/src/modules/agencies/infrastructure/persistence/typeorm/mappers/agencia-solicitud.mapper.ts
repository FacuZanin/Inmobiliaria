// backend\src\modules\agencias\infrastructure\persistence\typeorm\mappers\agencia-solicitud.mapper.ts
import { AgenciaSolicitud } from '../../../../domain/entities/agencia-solicitud.entity';

export const toDomain = (e: any): AgenciaSolicitud => {
  return e as AgenciaSolicitud;
};

export const toOrm = (d: Partial<AgenciaSolicitud>): Partial<AgenciaSolicitud> => {
  return d;
};
