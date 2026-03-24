// backend\src\modules\agencias\infrastructure\persistence\typeorm\repositories\agencias.typeorm.repository.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { AgenciasRepositoryPort } from '../../../../application/ports/agencias-repository.port';
import { Agencia } from '../../../../domain/entities/agencia.entity';
import type { CreateAgenciaDto } from '../../../../application/dto/create-agencia.dto';
import type { UpdateAgenciaDto } from '../../../../application/dto/update-agencia.dto';

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

  /**
   * Borra la agencia
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
