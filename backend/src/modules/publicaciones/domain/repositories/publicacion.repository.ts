// backend\src\modules\publicaciones\domain\repositories\publicacion.repository.ts
import { FilterPublicacionesDto } from '@modules/admin-publicaciones/application/dto/filter-publicaciones.dto';

import { PublicacionAggregate } from '../entities/publicacion.aggregate';

export abstract class PublicacionRepository {
  abstract save(
    publicacion: PublicacionAggregate,
  ): Promise<PublicacionAggregate>;

  abstract findById(
    id: number,
  ): Promise<PublicacionAggregate | null>;

  abstract update(
    id: number,
    partial: Partial<PublicacionAggregate>,
  ): Promise<PublicacionAggregate | null>;

  abstract delete(id: number): Promise<void>;

  abstract findAll(
    filters?: FilterPublicacionesDto,
  ): Promise<PublicacionAggregate[]>;
}