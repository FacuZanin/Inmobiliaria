// backend\src\modules\operaciones\application\ports\operacion-repository.port.ts
import { OperacionAggregate } from '../../domain/entities/operacion.aggregate';
import { FilterOperacionesDto } from '../dto/filter-operaciones.dto';

export interface OperacionRepositoryPort {
  save(operacion: OperacionAggregate): Promise<OperacionAggregate>;
  findById(id: number): Promise<OperacionAggregate | null>;
  findAll(filters?: FilterOperacionesDto): Promise<OperacionAggregate[]>;
  update(operacion: OperacionAggregate): Promise<OperacionAggregate>;
  delete(id: number): Promise<void>;
}
