// backend\src\modules\publicaciones\infrastructure\persistence\typeorm\repositories\publicacion.typeorm.repository.ts
import { Injectable }
  from '@nestjs/common';

import { InjectRepository }
  from '@nestjs/typeorm';

import { Repository }
  from 'typeorm';

import { PublicacionRepositoryPort }
from '../../../../application/ports/publicacion-repository.port';

import { PublicacionAggregate }
  from '../../../../domain/entities/publicacion.aggregate';

import { PublicacionEntity }
  from '../entities/publicacion.entity';

import { PublicacionMapper }
  from '../mappers/publicacion.mapper';

@Injectable()
export class PublicacionTypeOrmRepository
  implements PublicacionRepositoryPort
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

  async findAll(filters?: any) {
  const qb = this.repository
    .createQueryBuilder('publicacion')
    .leftJoinAndSelect('publicacion.propiedad', 'propiedad')
    .leftJoinAndSelect('publicacion.user', 'user')
    .orderBy('publicacion.createdAt', 'DESC');

  if (filters?.status) {
    qb.andWhere('publicacion.status = :status', {
      status: filters.status,
    });
  }

  if (filters?.search) {
    qb.andWhere(
      `(
        propiedad.titulo ILIKE :search
        OR user.email ILIKE :search
      )`,
      {
        search: `%${filters.search}%`,
      },
    );
  }

  return qb.getMany();
}
}