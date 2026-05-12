// backend\src\modules\agencias\infrastructure\persistence\typeorm\repositories\agencias.typeorm.repository.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { AgenciasRepositoryPort } from '../../../../application/ports/agencias-repository.port';

import { Agencia } from '../../../../domain/entities/agencia.entity';

import type { CreateAgenciaDto } from '../../../../application/dto/create-agencia.dto';
import type { UpdateAgenciaDto } from '../../../../application/dto/update-agencia.dto';

import { AgenciaStatus } from '@shared/contracts/enums/agencia-status.enum';

@Injectable()
export class AgenciasTypeOrmRepository implements AgenciasRepositoryPort {
  constructor(
    @InjectRepository(Agencia)
    private readonly repo: Repository<Agencia>,
  ) {}

  /**
   * Crea y guarda una agencia. Se hace un cast explícito para evitar inferencias raras.
   */
  async create(data: CreateAgenciaDto): Promise<Agencia> {
    try {
      const partial: Partial<Agencia> = { ...data } as Partial<Agencia>;
      const entity = this.repo.create(partial as any);
      const saved = (await this.repo.save(entity)) as unknown as Agencia;
      return saved;
    } catch (err) {
      console.error('[AgenciasTypeOrmRepository.create] ', err);
      throw new BadRequestException('Error al crear agencia');
    }
  }

  /**
   * Devuelve todas las agencias.
   */
  async findAll(): Promise<Agencia[]> {
    const list = await this.repo.find();
    return list as Agencia[];
  }

  /**
   * findOne mantiene compatibilidad con varias firmas de port (findOne o findById).
   */
  async findOne(id: number): Promise<Agencia | null> {
    return (await this.repo.findOne({ where: { id } })) as Agencia | null;
  }

  /**
   * Alias: algunos ports llaman a este método 'findById' — lo implementamos para compatibilidad.
   */
  async findById(id: number): Promise<Agencia | null> {
    return this.findOne(id);
  }

  /**
   * Actualiza la agencia
   */
  async update(id: number, data: UpdateAgenciaDto): Promise<Agencia> {
    const existing = await this.findOne(id);
    if (!existing) throw new BadRequestException('Agencia no encontrada');
    Object.assign(existing, data);
    const saved = await this.repo.save(existing);
    return saved as Agencia;
  }

  async suspender(id: number, motivo: string): Promise<Agencia> {
    const agencia = await this.findOne(id);

    if (!agencia) {
      throw new BadRequestException('Agencia no encontrada');
    }

    agencia.status = AgenciaStatus.SUSPENDIDA;
    agencia.motivoSuspension = motivo;
    agencia.suspendidaEn = new Date();

    return this.repo.save(agencia);
  }

  async reactivar(id: number): Promise<Agencia> {
    const agencia = await this.findOne(id);

    if (!agencia) {
      throw new BadRequestException('Agencia no encontrada');
    }

    agencia.status = AgenciaStatus.ACTIVA;
    agencia.motivoSuspension = null;
    agencia.suspendidaEn = null;

    return this.repo.save(agencia);
  }

  async restore(id: number): Promise<void> {
    await this.repo.restore(id);
  }

  /**
   * Borra la agencia
   */
  async softDelete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async createBasic(data: { nombre: string }): Promise<Agencia> {
    const agencia = this.repo.create({
      nombre: data.nombre,
    });

    return this.repo.save(agencia);
  }

  async findWithFilters(filters?: {
    nombre?: string;
    localidad?: string;
    activa?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Agencia[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;

    const qb = this.repo.createQueryBuilder('agencia');

    if (filters?.nombre) {
      qb.andWhere('LOWER(agencia.nombre) LIKE LOWER(:nombre)', {
        nombre: `%${filters.nombre}%`,
      });
    }

    if (filters?.localidad) {
      qb.andWhere('LOWER(agencia.localidad) LIKE LOWER(:localidad)', {
        localidad: `%${filters.localidad}%`,
      });
    }

    if (filters?.activa !== undefined) {
      qb.andWhere('agencia.activa = :activa', {
        activa: filters.activa,
      });
    }

    qb.orderBy('agencia.id', 'DESC');

    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
