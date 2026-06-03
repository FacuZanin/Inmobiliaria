// backend\src\modules\agencias\application\ports\agencia-solicitud-repository.port.ts
import type { AgenciaSolicitud } from '../../domain/entities/agencia-solicitud.entity';
import type { CreateSolicitudAgenciaDto } from '../dto/create-solicitud-agencia.dto';
import { AgenciaSolicitudEstado } from '@shared/contracts/enums/agencia-solicitud-estado.enum';

export interface AgenciaSolicitudRepositoryPort {
  create(
    data: CreateSolicitudAgenciaDto,
    userId: number,
  ): Promise<AgenciaSolicitud>;
  findPendientes(): Promise<AgenciaSolicitud[]>;
  findOne(id: number): Promise<AgenciaSolicitud | null>;
  save(solicitud: AgenciaSolicitud): Promise<AgenciaSolicitud>;
  findPendienteByUserId(userId: number): Promise<boolean>;
  countByEstado(estado: AgenciaSolicitudEstado): Promise<number>;
  countThisMonth(): Promise<number>;
  getSolicitudesByMonth(): Promise<
    {
      month: string;
      total: number;
    }[]
  >;
  findRecent(limit: number): Promise<AgenciaSolicitud[]>;
}
