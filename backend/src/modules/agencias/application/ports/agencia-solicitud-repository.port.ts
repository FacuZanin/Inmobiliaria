// backend\src\modules\agencias\application\ports\agencia-solicitud-repository.port.ts
import type { AgenciaSolicitud } from '../../domain/entities/agencia-solicitud.entity';
import type { CreateSolicitudAgenciaDto } from '../dto/create-solicitud-agencia.dto';


export interface AgenciaSolicitudRepositoryPort {
  create(data: CreateSolicitudAgenciaDto, userId: number): Promise<AgenciaSolicitud>;
  findPendientes(): Promise<AgenciaSolicitud[]>;
  findOne(id: number): Promise<AgenciaSolicitud | null>;
  save(solicitud: AgenciaSolicitud): Promise<AgenciaSolicitud>;
}
