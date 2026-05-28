// backend/src/modules/propiedades/infrastructure/persistence/typeorm/repositories/property.typeorm.repository.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PropertyAggregate } from '@modules/propiedades/domain/entities/property.aggregate';
import { PropertyRepositoryPort } from '@modules/propiedades/application/ports/property-repository.port';

import { PropertyEntity } from '../entities/propiedad.entity';
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

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

import { PROPERTY_FULL_RELATIONS } from '../constants/property-relations.constants';

import { PublicPropertiesQueryDto } from '@modules/propiedades/application/dto/public-properties-query.dto';
import { AdminPropertiesQueryDto } from '@modules/propiedades/application/dto/admin-properties-query.dto';

@Injectable()
export class PropertyTypeOrmRepository implements PropertyRepositoryPort {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propiedadRepo: Repository<PropertyEntity>,

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
      const baseOrm = this.propiedadRepo.create(
        PropertyMapper.toOrm(property) as PropertyEntity,
      );

      const savedBase = await this.propiedadRepo.save(baseOrm);

      const detailEntity = PropertyDetailsMapper.toOrm(property, savedBase);

      if (detailEntity) {
        const repo = this.getDetailRepo(property.tipo);
        await repo.save(detailEntity);
      }

      const reloaded = await this.propiedadRepo.findOne({
        where: { id: savedBase.id },
        relations: PROPERTY_FULL_RELATIONS,
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
      relations: PROPERTY_FULL_RELATIONS,
    });

    return entity ? PropertyMapper.toDomain(entity) : null;
  }

  async findPendingModeration(
    query: AdminPropertiesQueryDto,
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }> {
    const {
      limit = 20,
      page = 1,
      sortBy = 'createdAt',
      order = 'DESC',
      search,
      agencyId,
      verified,
      dateFrom,
      dateTo,
    } = query;

    const qb = this.propiedadRepo.createQueryBuilder('p');

    qb.leftJoinAndSelect('p.agencia', 'agencia');
    qb.leftJoinAndSelect('p.creadoPor', 'creadoPor');

    qb.where('p.deletedAt IS NULL');

    qb.andWhere(
      `
      (
        p.moderationStatus = :revision
        OR p.moderationStatus = :observada
      )
      `,
      {
        revision: PublicacionStatus.EN_REVISION,
        observada: PublicacionStatus.OBSERVADA,
      },
    );

    if (search) {
      qb.andWhere(
        `
        (
          LOWER(p.titulo) LIKE LOWER(:search)
          OR LOWER(p.descripcion) LIKE LOWER(:search)
          OR LOWER(p.localidad) LIKE LOWER(:search)
        )
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    if (agencyId) {
      qb.andWhere('p.agenciaId = :agencyId', {
        agencyId,
      });
    }

    if (verified !== undefined) {
      qb.andWhere('p.moderationStatus = :verifiedStatus', {
        verifiedStatus: verified
          ? PublicacionStatus.PUBLICADA_VERIFICADA
          : PublicacionStatus.PUBLICADA_NO_VERIFICADA,
      });
    }

    if (dateFrom) {
      qb.andWhere('p.createdAt >= :dateFrom', {
        dateFrom,
      });
    }

    if (dateTo) {
      qb.andWhere('p.createdAt <= :dateTo', {
        dateTo,
      });
    }

    qb.orderBy(`p.${sortBy}`, order);

    qb.take(limit);
    qb.skip((page - 1) * limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map(PropertyMapper.toDomain),
      total,
    };
  }

  async findByModerationStatus(
    moderationStatus: PublicacionStatus,
    query: AdminPropertiesQueryDto,
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }> {
    const {
      limit = 20,
      page = 1,
      sortBy = 'createdAt',
      order = 'DESC',
      search,
      agencyId,
      verified,
      dateFrom,
      dateTo,
    } = query;

    const qb = this.propiedadRepo.createQueryBuilder('p');

    qb.leftJoinAndSelect('p.agencia', 'agencia');
    qb.leftJoinAndSelect('p.creadoPor', 'creadoPor');

    qb.where('p.deletedAt IS NULL');

    qb.andWhere('p.moderationStatus = :moderationStatus', {
      moderationStatus,
    });

    if (search) {
      qb.andWhere(
        `
        (
          LOWER(p.titulo) LIKE LOWER(:search)
          OR LOWER(p.descripcion) LIKE LOWER(:search)
          OR LOWER(p.localidad) LIKE LOWER(:search)
        )
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    if (agencyId) {
      qb.andWhere('p.agenciaId = :agencyId', {
        agencyId,
      });
    }

    if (verified !== undefined) {
      qb.andWhere('p.moderationStatus = :verifiedStatus', {
        verifiedStatus: verified
          ? PublicacionStatus.PUBLICADA_VERIFICADA
          : PublicacionStatus.PUBLICADA_NO_VERIFICADA,
      });
    }

    if (dateFrom) {
      qb.andWhere('p.createdAt >= :dateFrom', {
        dateFrom,
      });
    }

    if (dateTo) {
      qb.andWhere('p.createdAt <= :dateTo', {
        dateTo,
      });
    }

    qb.orderBy(`p.${sortBy}`, order);

    qb.take(limit);
    qb.skip((page - 1) * limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map(PropertyMapper.toDomain),
      total,
    };
  }

  async findAll(
    query: PublicPropertiesQueryDto,
  ): Promise<{
    items: PropertyAggregate[];
    total: number;
  }> {
    const {
      tipo,
      operacion,
      localidad,
      precioMin,
      precioMax,
      ambientes,
      dormitorios,
      banos,
      search,
      agencyId,
      limit = 20,
       page = 1,
      order = 'DESC',
    } = query;

    const qb = this.propiedadRepo
      .createQueryBuilder('p')
      .loadRelationCountAndMap('p.favoriteCount', 'p.favorites');

    qb.leftJoinAndSelect('p.agencia', 'agencia');

    qb.where('p.deletedAt IS NULL');

    qb.andWhere('p.status = :publicStatus', {
      publicStatus: PropertyStatus.PUBLICADA,
    });

    qb.andWhere('p.moderationStatus != :rejectedStatus', {
      rejectedStatus: PublicacionStatus.RECHAZADA,
    });

    qb.andWhere('p.moderationStatus != :eliminatedStatus', {
      eliminatedStatus: PublicacionStatus.ELIMINADA,
    });

    if (tipo) {
      qb.andWhere('p.tipo = :tipo', {
        tipo,
      });
    }

    if (operacion) {
      qb.andWhere('p.operacion = :operacion', {
        operacion,
      });
    }

    if (localidad) {
      qb.andWhere('LOWER(p.localidad) LIKE LOWER(:localidad)', {
        localidad: `%${localidad}%`,
      });
    }

    if (precioMin !== undefined) {
      qb.andWhere('p.precio >= :precioMin', {
        precioMin,
      });
    }

    if (precioMax !== undefined) {
      qb.andWhere('p.precio <= :precioMax', {
        precioMax,
      });
    }

    if (ambientes !== undefined) {
      qb.andWhere('p.ambientes = :ambientes', {
        ambientes,
      });
    }

    if (dormitorios !== undefined) {
      qb.andWhere('p.dormitorios = :dormitorios', {
        dormitorios,
      });
    }

    if (banos !== undefined) {
      qb.andWhere('p.banos = :banos', {
        banos,
      });
    }

    if (agencyId !== undefined) {
      qb.andWhere('p.agenciaId = :agencyId', {
        agencyId,
      });
    }

    if (search) {
      qb.andWhere(
        `
        (
          LOWER(p.titulo) LIKE LOWER(:search)
          OR LOWER(p.descripcion) LIKE LOWER(:search)
          OR LOWER(p.localidad) LIKE LOWER(:search)
        )
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy('p.createdAt', order);

    qb.take(limit);
    qb.skip((page - 1) * limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map(PropertyMapper.toDomain),
      total,
    };
  }

  async update(
    id: number,
    property: PropertyAggregate,
  ): Promise<PropertyAggregate | null> {
    try {
      const baseOrm = this.propiedadRepo.create(
        PropertyMapper.toOrm(property) as PropertyEntity,
      );

      await this.propiedadRepo.save(baseOrm);

      const reloaded = await this.propiedadRepo.findOne({
        where: { id },
        relations: PROPERTY_FULL_RELATIONS,
      });

      if (!reloaded) {
        return null;
      }

      const detailEntity = PropertyDetailsMapper.toOrm(property, reloaded);

      if (detailEntity) {
        const repo = this.getDetailRepo(property.tipo);
        await repo.save(detailEntity);
      }

      const finalReload = await this.propiedadRepo.findOne({
        where: { id },
        relations: PROPERTY_FULL_RELATIONS,
      });

      return finalReload ? PropertyMapper.toDomain(finalReload) : null;
    } catch (err) {
      console.error('[PropertyTypeOrmRepository.update]', err);
      throw new BadRequestException('Error al actualizar propiedad');
    }
  }

  async softDelete(id: number): Promise<void> {
    await this.propiedadRepo.softDelete(id);
  }

  async countByUser(userId: number): Promise<number> {
    return this.propiedadRepo.count({
      where: {
        creadoPor: {
          id: userId,
        },
      },
    });
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