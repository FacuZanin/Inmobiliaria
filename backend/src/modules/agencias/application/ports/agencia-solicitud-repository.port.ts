// backend\src\modules\agencias\application\ports\agencia-solicitud-repository.port.ts
import type { AgenciaSolicitud } from '../../domain/entities/agencia-solicitud.entity';
import type { SolicitudAgenciaDto } from '../dto/solicitud-agencia.dto';
import type { CrearSolicitudAgenciaDto } from '../dto/crear-solicitud-agencia.dto';

export interface AgenciaSolicitudRepositoryPort {
  create(data: SolicitudAgenciaDto, userId: number): Promise<AgenciaSolicitud>;
  findPendientes(): Promise<AgenciaSolicitud[]>;
  findOne(id: number): Promise<AgenciaSolicitud | null>;
  save(solicitud: AgenciaSolicitud): Promise<AgenciaSolicitud>;
  createBasic(dto: CrearSolicitudAgenciaDto): Promise<any>;
}
