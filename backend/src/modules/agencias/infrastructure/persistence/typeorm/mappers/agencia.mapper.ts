// backend\src\modules\agencias\infrastructure\persistence\typeorm\mappers\agencia.mapper.ts
import { Agencia } from '../../../../domain/entities/agencia.entity';

export const toDomain = (e: any): Agencia => {
  return e as Agencia;
};

export const toOrm = (d: Partial<Agencia>): Partial<Agencia> => {
  return d;
};
