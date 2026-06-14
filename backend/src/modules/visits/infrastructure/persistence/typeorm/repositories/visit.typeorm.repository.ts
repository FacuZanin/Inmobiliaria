import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { VisitEntity } from '@/modules/visits/domain/entities/visit.entity';
import { VisitRepositoryPort } from '@/modules/visits/domain/repositories/visit.repository.port';
import { VisitMapper } from '@/modules/visits/infrastructure/mappers/visit.mapper';
import { VisitOrmEntity } from '../entities/visit.orm-entity';

@Injectable()
export class VisitTypeOrmRepository extends VisitRepositoryPort {
  constructor(
    @InjectRepository(VisitOrmEntity)
    private readonly repository: Repository<VisitOrmEntity>,
  ) {
    super();
  }

  async save(visit: VisitEntity): Promise<VisitEntity> {
    const saved = await this.repository.save(VisitMapper.toOrm(visit));

    return VisitMapper.toDomain(saved);
  }

  async findById(id: number): Promise<VisitEntity | null> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });

    return entity ? VisitMapper.toDomain(entity) : null;
  }

  async findByRequester(requesterId: number): Promise<VisitEntity[]> {
    const entities = await this.repository.find({
      where: {
        requesterId,
      },
      order: {
        desiredAt: 'DESC',
      },
    });

    return entities.map((entity) => VisitMapper.toDomain(entity));
  }

  async findByOwner(ownerId: number, agencyId?: number | null): Promise<VisitEntity[]> {
    const qb = this.repository
      .createQueryBuilder('visit')
      .where('visit.ownerId = :ownerId', { ownerId });

    if (agencyId) {
      qb.orWhere(
        new Brackets((subQb) => {
          subQb.where('visit.agencyId = :agencyId', { agencyId });
        }),
      );
    }

    const entities = await qb
      .orderBy('visit.desiredAt', 'DESC')
      .getMany();

    return entities.map((entity) => VisitMapper.toDomain(entity));
  }
}
