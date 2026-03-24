// backend\src\modules\agencias\infrastructure\persistence\typeorm\repositories\agencia-solicitud.typeorm.repository.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { AgenciaSolicitudRepositoryPort } from '../../../../application/ports/agencia-solicitud-repository.port';
import { AgenciaSolicitud, AgenciaSolicitudEstado } from '../../../../domain/entities/agencia-solicitud.entity';
import type { SolicitudAgenciaDto } from '../../../../application/dto/solicitud-agencia.dto';
import { Agencia } from '../../../../domain/entities/agencia.entity';
import { User } from '../../../../../user/domain/entities/user.entity';


@Injectable()
export class AgenciaSolicitudTypeOrmRepository implements AgenciaSolicitudRepositoryPort {
  constructor(
    @InjectRepository(AgenciaSolicitud)
    private readonly repo: Repository<AgenciaSolicitud>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Agencia)
    private readonly agenciaRepo?: Repository<Agencia>,
  ) {}

  async create(data: SolicitudAgenciaDto, userId: number): Promise<AgenciaSolicitud> {
    // crear y castear explícitamente a la entidad para evitar inferencias indeseadas
    const s = this.repo.create({
      ...data,
      usuario: { id: userId } as any,
      estado: AgenciaSolicitudEstado.PENDIENTE,
    } as Partial<AgenciaSolicitud>) as AgenciaSolicitud;

    return await this.repo.save(s);
  }

  async findPendientes(): Promise<AgenciaSolicitud[]> {
    // usar el enum en lugar de string literal
    return this.repo.find({
      where: { estado: AgenciaSolicitudEstado.PENDIENTE },
      order: { creadaEn: 'DESC' },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<AgenciaSolicitud | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['usuario'],
    });
  }

  async save(solicitud: AgenciaSolicitud): Promise<AgenciaSolicitud> {
    return this.repo.save(solicitud);
  }

  async approveAndAssignUser(solicitudId: number, nuevaAgencia: Agencia): Promise<AgenciaSolicitud> {
    // Cargar solicitud con usuario
    const solicitud = await this.repo.findOne({
      where: { id: solicitudId },
      relations: ['usuario'],
    });
    if (!solicitud) throw new BadRequestException('Solicitud no encontrada');

    // Crear agencia
    const agenciaEntity = this.agenciaRepo ? this.agenciaRepo.create(nuevaAgencia as any) : undefined;
    const savedAgencia = agenciaEntity ? await this.agenciaRepo!.save(agenciaEntity) : undefined;

    // Actualizar usuario (asignar role y agencia)
    if (solicitud.usuario) {
      (solicitud.usuario as any).role = 'AGENCIA';
      if (savedAgencia) (solicitud.usuario as any).agencia = savedAgencia;
      await this.userRepo.save(solicitud.usuario);
    }

    // Marcar solicitud aprobada
    solicitud.estado = AgenciaSolicitudEstado.APROBADA;
    return this.repo.save(solicitud);
  }
}
