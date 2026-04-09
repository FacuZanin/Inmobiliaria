// backend\src\modules\agencias\application\ports\agencias-repository.port.ts
import { Agencia } from '../../domain/entities/agencia.entity';
import { CreateAgenciaDto } from '../dto/create-agencia.dto';
import { UpdateAgenciaDto } from '../dto/update-agencia.dto';

export interface AgenciasRepositoryPort {
  findAll(): Promise<Agencia[]>;
  findById(id: number): Promise<Agencia | null>;
  create(data: CreateAgenciaDto): Promise<Agencia>;
  update(id: number, data: UpdateAgenciaDto): Promise<Agencia>;
  delete(id: number): Promise<void>;
  createBasic(data: { nombre: string }): Promise<Agencia>;
}
