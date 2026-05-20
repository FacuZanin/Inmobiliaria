// backend\src\modules\publicaciones\application\ports\publicacion-repository.port.ts
import { PublicacionAggregate }
from '../../domain/entities/publicacion.aggregate';

export interface PublicacionRepositoryPort {
  save(
    publicacion: PublicacionAggregate,
  ): Promise<PublicacionAggregate>;

  findById(
    id: number,
  ): Promise<PublicacionAggregate | null>;

  update(
    id: number,
    partial:
      Partial<PublicacionAggregate>,
  ): Promise<PublicacionAggregate | null>;

  delete(
    id: number,
  ): Promise<void>;
}