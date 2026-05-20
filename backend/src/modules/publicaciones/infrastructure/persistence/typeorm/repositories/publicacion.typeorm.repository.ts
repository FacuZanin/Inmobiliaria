// backend\src\modules\publicaciones\infrastructure\persistence\typeorm\repositories\publicacion.typeorm.repository.ts
import { Injectable }
  from '@nestjs/common';

import { InjectRepository }
  from '@nestjs/typeorm';

import { Repository }
  from 'typeorm';

import { PublicacionRepository }
  from '../../../../domain/repositories/publicacion.repository';

import { PublicacionAggregate }
  from '../../../../domain/entities/publicacion.aggregate';

import { PublicacionEntity }
  from '../entities/publicacion.entity';

import { PublicacionMapper }
  from '../mappers/publicacion.mapper';

@Injectable()
export class PublicacionTypeOrmRepository
  implements PublicacionRepository
{
  constructor(
    @InjectRepository(PublicacionEntity)
    private readonly repository:
      Repository<PublicacionEntity>,
  ) {}

  async save(
    publicacion: PublicacionAggregate,
  ): Promise<PublicacionAggregate> {
    const ormEntity =
      this.repository.create(
        PublicacionMapper.toOrm(
          publicacion,
        ),
      );

    const saved =
      await this.repository.save(
        ormEntity,
      );

    return PublicacionMapper.toDomain(
      saved,
    );
  }

  async findById(
    id: number,
  ): Promise<PublicacionAggregate | null> {
    const entity =
      await this.repository.findOne({
        where: { id },
      });

    if (!entity) {
      return null;
    }

    return PublicacionMapper.toDomain(
      entity,
    );
  }

  async update(
    id: number,
    partial:
      Partial<PublicacionAggregate>,
  ): Promise<PublicacionAggregate | null> {
    await this.repository.update(
      id,
      partial as any,
    );

    return this.findById(id);
  }

  async delete(
    id: number,
  ): Promise<void> {
    await this.repository.delete(id);
  }
}