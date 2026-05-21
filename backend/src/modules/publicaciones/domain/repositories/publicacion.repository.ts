// backend\src\modules\publicaciones\domain\repositories\publicacion.repository.ts
import { PublicacionAggregate } from '@modules/publicaciones/domain/entities/publicacion.aggregate';

import { FilterPublicacionesDto } from '@modules/admin-publicaciones/application/dto/filter-publicaciones.dto';

export abstract class PublicacionRepository {
  abstract save(
    publicacion: PublicacionAggregate,
  ): Promise<PublicacionAggregate>;

  abstract findById(
    id: number,
  ): Promise<PublicacionAggregate | null>;

  abstract update(
    id: number,
    publicacion: Partial<PublicacionAggregate>,
  ): Promise<PublicacionAggregate | null>;

  abstract delete(id: number): Promise<void>;

  abstract findAll(
  filters?: FilterPublicacionesDto,
): Promise<PublicacionAggregate[]>;
}