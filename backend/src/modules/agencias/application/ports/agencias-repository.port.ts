// backend\src\modules\agencias\application\ports\agencias-repository.port.ts
import { Agencia } from '../../domain/entities/agencia.entity';
import { CreateAgenciaDto } from '../dto/create-agencia.dto';
import { UpdateAgenciaDto } from '../dto/update-agencia.dto';

import { AgenciaStatus } from '@shared/contracts/enums/agencia-status.enum';

export interface AgenciasRepositoryPort {
  findAll(): Promise<Agencia[]>;
  findById(id: number): Promise<Agencia | null>;
  create(data: CreateAgenciaDto): Promise<Agencia>;
  update(id: number, data: UpdateAgenciaDto): Promise<Agencia>;
  createBasic(data: { nombre: string }): Promise<Agencia>;
  findWithFilters(filters?: {
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
  }>;
  suspender(id: number, motivo: string): Promise<Agencia>;
  reactivar(id: number): Promise<Agencia>;
  softDelete(id: number): Promise<void>;
  restore(id: number): Promise<void>;
  countAll(): Promise<number>;
  countByStatus(status: AgenciaStatus): Promise<number>;
  countDeleted(): Promise<number>;
  countNewAgenciasThisMonth(): Promise<number>;
  getAgenciasCreatedByMonth(): Promise<
    {
      month: string;
      total: number;
    }[]
  >;
  findRecentAgencias(limit: number): Promise<Agencia[]>;
}
