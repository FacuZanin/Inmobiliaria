// backend\src\modules\propiedades\infrastructure\persistence\typeorm\repositories\property.typeorm.repository.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PropertyAggregate } from '../../../../domain/entities/property.aggregate';
import { PropertyRepositoryPort } from '../../../../application/ports/property-repository.port';

import { Propiedad } from '../entities/propiedad.entity';
import { PropiedadCasa } from '../entities/propiedad-casa.entity';
import { PropiedadDepartamento } from '../entities/propiedad-departamento.entity';
import { PropiedadLote } from '../entities/propiedad-lote.entity';
import { PropiedadLocal } from '../entities/propiedad-local.entity';
import { PropiedadOficina } from '../entities/propiedad-oficina.entity';
import { PropiedadCampo } from '../entities/propiedad-campo.entity';
import { PropiedadPH } from '../entities/propiedad-ph.entity';
import { PropiedadPozo } from '../entities/propiedad-pozo.entity';

import { PropertyMapper } from '../mappers/property.mapper';
import { PropertyDetailsMapper } from '../mappers/property-details.mapper';

@Injectable()
export class PropertyTypeOrmRepository implements PropertyRepositoryPort {
  constructor(
    @InjectRepository(Propiedad)
    private readonly propiedadRepo: Repository<Propiedad>,

    @InjectRepository(PropiedadCasa)
    private readonly casaRepo: Repository<PropiedadCasa>,

    @InjectRepository(PropiedadDepartamento)
    private readonly deptoRepo: Repository<PropiedadDepartamento>,

    @InjectRepository(PropiedadLote)
    private readonly loteRepo: Repository<PropiedadLote>,

    @InjectRepository(PropiedadLocal)
    private readonly localRepo: Repository<PropiedadLocal>,

    @InjectRepository(PropiedadOficina)
    private readonly oficinaRepo: Repository<PropiedadOficina>,

    @InjectRepository(PropiedadCampo)
    private readonly campoRepo: Repository<PropiedadCampo>,

    @InjectRepository(PropiedadPH)
    private readonly phRepo: Repository<PropiedadPH>,

    @InjectRepository(PropiedadPozo)
    private readonly pozoRepo: Repository<PropiedadPozo>,
  ) {}

  async save(property: PropertyAggregate): Promise<PropertyAggregate> {
    try {
      // 1️⃣ map aggregate -> base ORM
      const baseOrm = this.propiedadRepo.create(
        PropertyMapper.toOrm(property) as Propiedad,
      );

      const savedBase = await this.propiedadRepo.save(baseOrm);

      // 2️⃣ map & persist detalles (si existen)
      const detailEntity = PropertyDetailsMapper.toOrm(property, savedBase);

      if (detailEntity) {
        const repo = this.getDetailRepo(property.tipo);
        await repo.save(detailEntity);
      }

      // 3️⃣ reload con relaciones
      const reloaded = await this.propiedadRepo.findOne({
        where: { id: savedBase.id },
        relations: [
          'casa',
          'departamento',
          'lote',
          'local',
          'oficina',
          'campo',
          'ph',
          'pozo',
          'creadoPor',
          'agencia',
        ],
      });

      return PropertyMapper.toDomain(reloaded!);
    } catch (err) {
      console.error('[PropertyTypeOrmRepository.save]', err);
      throw new BadRequestException('Error al guardar propiedad');
    }
  }

  async findById(id: number): Promise<PropertyAggregate | null> {
    const entity = await this.propiedadRepo.findOne({
      where: { id },
      relations: [
        'casa',
        'departamento',
        'lote',
        'local',
        'oficina',
        'campo',
        'ph',
        'pozo',
        'creadoPor',
        'agencia',
      ],
    });

    return entity ? PropertyMapper.toDomain(entity) : null;
  }

  async findAll(
    filters: any = {},
    opts?: {
      limit?: number;
      offset?: number;
    },
  ) {
    const qb = this.propiedadRepo.createQueryBuilder('p').loadRelationCountAndMap(
    'p.favoriteCount',
    'p.favorites',);

    qb.leftJoinAndSelect('p.agencia', 'agencia');

    qb.where('p.deletedAt IS NULL');

    if (filters.tipo) {
      qb.andWhere('p.tipo = :tipo', {
        tipo: filters.tipo,
      });
    }

    if (filters.operacion) {
      qb.andWhere('p.operacion = :operacion', {
        operacion: filters.operacion,
      });
    }

    if (filters.localidad) {
      qb.andWhere('LOWER(p.localidad) LIKE LOWER(:localidad)', {
        localidad: `%${filters.localidad}%`,
      });
    }

    if (filters.precioMin !== undefined) {
      qb.andWhere('p.precio >= :precioMin', {
        precioMin: filters.precioMin,
      });
    }

    if (filters.precioMax !== undefined) {
      qb.andWhere('p.precio <= :precioMax', {
        precioMax: filters.precioMax,
      });
    }

    if (filters.ambientes !== undefined) {
      qb.andWhere('p.ambientes = :ambientes', {
        ambientes: filters.ambientes,
      });
    }

    if (filters.dormitorios !== undefined) {
      qb.andWhere('p.dormitorios = :dormitorios', {
        dormitorios: filters.dormitorios,
      });
    }

    if (filters.banos !== undefined) {
      qb.andWhere('p.banos = :banos', {
        banos: filters.banos,
      });
    }

    if (filters.agenciaId !== undefined) {
      qb.andWhere('p.agenciaId = :agenciaId', {
        agenciaId: filters.agenciaId,
      });
    }

    if (filters.search) {
      qb.andWhere(
        `
      (
        LOWER(p.titulo) LIKE LOWER(:search)
        OR LOWER(p.descripcion) LIKE LOWER(:search)
        OR LOWER(p.localidad) LIKE LOWER(:search)
      )
      `,
        {
          search: `%${filters.search}%`,
        },
      );
    }
    if (filters.status) {
      qb.andWhere('p.status = :status', {
        status: filters.status,
      });
    }

    qb.orderBy('p.creadoEn', filters.sort === 'ASC' ? 'ASC' : 'DESC');

    qb.take(opts?.limit ?? 20);
    qb.skip(opts?.offset ?? 0);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map(PropertyMapper.toDomain),
      total,
    };
  }

  async update(id: number, partial: any): Promise<PropertyAggregate | null> {
    await this.propiedadRepo.update(id, partial);
    return this.findById(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.propiedadRepo.softDelete(id);
  }

  private getDetailRepo(tipo: string): Repository<any> {
    switch (tipo) {
      case 'CASA':
        return this.casaRepo;
      case 'DEPARTAMENTO':
        return this.deptoRepo;
      case 'LOTE':
        return this.loteRepo;
      case 'LOCAL':
        return this.localRepo;
      case 'OFICINA':
        return this.oficinaRepo;
      case 'CAMPO':
        return this.campoRepo;
      case 'PH':
        return this.phRepo;
      case 'POZO':
        return this.pozoRepo;
      default:
        throw new Error(`Tipo de propiedad no soportado: ${tipo}`);
    }
  }
}
