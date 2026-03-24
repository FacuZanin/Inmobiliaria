// backend\src\modules\operaciones\infrastructure\persistence\typeorm\repositories\operacion.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Operacion } from '../entities/operacion.entity';
import { OperacionRepositoryPort } from '../../../../application/ports/operacion-repository.port';
import { OperacionAggregate } from '../../../../domain/entities/operacion.aggregate';
import { OperacionMapper } from '../mappers/operacion.mapper';

@Injectable()
export class OperacionTypeOrmRepository implements OperacionRepositoryPort {
  constructor(
    @InjectRepository(Operacion)
    private readonly repo: Repository<Operacion>,
  ) {}

  async save(operacion: OperacionAggregate): Promise<OperacionAggregate> {
    const entity = this.repo.create();

    OperacionMapper.toOrm(operacion, entity);

    entity.propiedad = { id: operacion.propiedadId } as any;
    entity.creadoPor = { id: operacion.creadoPorId } as any;

    if (operacion.agenciaId) {
      entity.agencia = { id: operacion.agenciaId } as any;
    }

    if (operacion.propietarioDirectoId) {
      entity.propietarioDirecto = { id: operacion.propietarioDirectoId } as any;
    }

    if (operacion.compradorInquilinoId) {
      entity.compradorInquilino = { id: operacion.compradorInquilinoId } as any;
    }

    const saved = await this.repo.save(entity);
    return OperacionMapper.toDomain(saved);
  }

  async findById(id: number): Promise<OperacionAggregate | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? OperacionMapper.toDomain(entity) : null;
  }

async findAll(filters?: any): Promise<OperacionAggregate[]> {
  const qb = this.repo.createQueryBuilder('o')
    .leftJoinAndSelect('o.propiedad', 'propiedad')
    .leftJoinAndSelect('o.agencia', 'agencia')
    .leftJoinAndSelect('o.propietarioDirecto', 'propietarioDirecto')
    .leftJoinAndSelect('o.creadoPor', 'creadoPor')
    .leftJoinAndSelect('o.compradorInquilino', 'compradorInquilino')
    .orderBy('o.id', 'DESC');

  if (filters?.tipo) {
    qb.andWhere('o.tipo = :tipo', { tipo: filters.tipo });
  }

  if (filters?.estado) {
    qb.andWhere('o.estado = :estado', { estado: filters.estado });
  }

  if (filters?.propiedadId) {
    qb.andWhere('propiedad.id = :propiedadId', {
      propiedadId: filters.propiedadId,
    });
  }

  if (filters?.fechaDesde) {
    qb.andWhere('o.creadoEn >= :fechaDesde', {
      fechaDesde: new Date(filters.fechaDesde),
    });
  }

  if (filters?.fechaHasta) {
    qb.andWhere('o.creadoEn <= :fechaHasta', {
      fechaHasta: new Date(filters.fechaHasta),
    });
  }

  const entities = await qb.getMany();
  return entities.map(OperacionMapper.toDomain);
}


  async update(operacion: OperacionAggregate): Promise<OperacionAggregate> {
    const entity = await this.repo.findOneOrFail({
      where: { id: operacion.id! },
    });

    OperacionMapper.toOrm(operacion, entity);

    const saved = await this.repo.save(entity);
    return OperacionMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

