import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { OperationEntity } from '@/modules/operaciones/domain/entities/operation.entity';
import { OperationRepositoryPort } from '@/modules/operaciones/domain/repositories/operation.repository.port';
import { OperationMapper } from '@/modules/operaciones/infrastructure/mappers/operation.mapper';
import { OperationOrmEntity } from '../entities/operation.orm-entity';
import { OperationHistoryOrmEntity } from '../entities/operation-history.orm-entity';

@Injectable()
export class OperationTypeOrmRepository extends OperationRepositoryPort {
  constructor(
    @InjectRepository(OperationOrmEntity)
    private readonly repository: Repository<OperationOrmEntity>,

    @InjectRepository(OperationHistoryOrmEntity)
    private readonly historyRepository: Repository<OperationHistoryOrmEntity>,
  ) {
    super();
  }

  async save(operation: OperationEntity): Promise<OperationEntity> {
    const saved = await this.repository.save(OperationMapper.toOrm(operation));
    const newHistory = operation.history.filter((history) => history.id === null);

    if (newHistory.length > 0) {
      await this.historyRepository.save(
        newHistory.map((history) => OperationMapper.historyToOrm(history, saved.id)),
      );
    }

    return this.reload(saved.id);
  }

  async findById(id: number): Promise<OperationEntity | null> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        history: true,
      },
      order: {
        history: {
          createdAt: 'ASC',
        },
      },
    });

    return entity ? OperationMapper.toDomain(entity) : null;
  }

  async findByBuyer(buyerId: number): Promise<OperationEntity[]> {
    const entities = await this.repository.find({
      where: {
        buyerId,
      },
      relations: {
        history: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return entities.map((entity) => OperationMapper.toDomain(entity));
  }

  async findByOwner(ownerId: number, agencyId?: number | null): Promise<OperationEntity[]> {
    const qb = this.repository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.history', 'history')
      .where('operation.ownerId = :ownerId', { ownerId });

    if (agencyId) {
      qb.orWhere(
        new Brackets((subQb) => {
          subQb.where('operation.agencyId = :agencyId', { agencyId });
        }),
      );
    }

    const entities = await qb
      .orderBy('operation.updatedAt', 'DESC')
      .addOrderBy('history.createdAt', 'ASC')
      .getMany();

    return entities.map((entity) => OperationMapper.toDomain(entity));
  }

  private async reload(id: number): Promise<OperationEntity> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        history: true,
      },
      order: {
        history: {
          createdAt: 'ASC',
        },
      },
    });

    if (!entity) {
      throw new Error(`Failed to reload operation ${id}`);
    }

    return OperationMapper.toDomain(entity);
  }
}
