// backend\src\modules\publicaciones\domain\repositories\publicacion.repository.ts
import { PublicacionAggregate }
  from '../entities/publicacion.aggregate';

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

  abstract findAll(filters?: any): Promise<any[]>;
}