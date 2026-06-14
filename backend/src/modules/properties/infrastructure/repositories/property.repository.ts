import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyAggregate } from '../../domain/aggregates/property.aggregate';
import { PropertyRepositoryPort } from '../../domain/repositories/property.repository.port';
import { PropertyMapper } from '../mappers/property.mapper';
import { PropertyOrmEntity } from '../persistence/typeorm/entities/property.orm-entity';

@Injectable()
export class PropertyRepository implements PropertyRepositoryPort {
  constructor(
    @InjectRepository(PropertyOrmEntity)
    private readonly repository: Repository<PropertyOrmEntity>,
  ) {}

  async save(property: PropertyAggregate): Promise<PropertyAggregate> {
    const entity = this.repository.create(PropertyMapper.toOrm(property));
    const saved = await this.repository.save(entity);

    return this.reload(saved.id);
  }

  async update(
    id: number,
    property: PropertyAggregate,
  ): Promise<PropertyAggregate> {
    const entity = this.repository.create({
      ...PropertyMapper.toOrm(property),
      id,
    });

    await this.repository.save(entity);

    return this.reload(id);
  }

  async findById(id: number): Promise<PropertyAggregate | null> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });

    return entity ? PropertyMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  private async reload(id: number): Promise<PropertyAggregate> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      throw new Error(`Failed to reload property ${id}`);
    }

    return PropertyMapper.toDomain(entity);
  }
}
