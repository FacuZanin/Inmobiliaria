import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Operacion } from './entities/operacion.entity';
import { CreateOperacionDto } from './dto/create-operacion.dto';
import { UpdateOperacionDto } from './dto/update-operacion.dto';
import { FilterOperacionesDto } from './dto/filter-operaciones.dto';

import { User } from '../users/user.entity/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { OperacionEstado } from '../common/enums/operacion-estado.enum';


@Injectable()
export class OperacionesService {
  constructor(
    @InjectRepository(Operacion)
    private readonly operacionesRepo: Repository<Operacion>,
  ) {}

async create(dto: CreateOperacionDto, user: User) {
  const operacion = this.operacionesRepo.create({
    tipo: dto.tipo,
    medio: dto.medio,
    fechaReserva: dto.fechaReserva ? new Date(dto.fechaReserva) : null,
    observaciones: dto.observaciones || null,

    propiedad: { id: dto.propiedadId } as any,

    agencia: dto.agenciaId
      ? ({ id: dto.agenciaId } as any)
      : user.agencia
      ? ({ id: user.agencia.id } as any)
      : null,

    propietarioDirecto: dto.propietarioDirectoId
      ? ({ id: dto.propietarioDirectoId } as any)
      : null,

    compradorInquilino: dto.compradorInquilinoId
      ? ({ id: dto.compradorInquilinoId } as any)
      : null,

    creadoPor: { id: user.id } as any,
  });

  return this.operacionesRepo.save(operacion);
}

  async findAll(filters: FilterOperacionesDto, user: User) {
    const qb = this.operacionesRepo
      .createQueryBuilder('op')
      .leftJoinAndSelect('op.propiedad', 'propiedad')
      .leftJoinAndSelect('op.agencia', 'agencia')
      .leftJoinAndSelect('op.creadoPor', 'creadoPor')
      .leftJoinAndSelect('op.propietarioDirecto', 'propDir')
      .leftJoinAndSelect('op.compradorInquilino', 'compInq');

    // FILTROS
    if (filters.tipo) qb.andWhere('op.tipo = :tipo', { tipo: filters.tipo });
    if (filters.estado) qb.andWhere('op.estado = :estado', { estado: filters.estado });
    if (filters.fechaDesde)
      qb.andWhere('op.creadoEn >= :fechaDesde', { fechaDesde: filters.fechaDesde });
    if (filters.fechaHasta)
      qb.andWhere('op.creadoEn <= :fechaHasta', { fechaHasta: filters.fechaHasta });
    if (filters.propiedadId)
      qb.andWhere('propiedad.id = :pId', { pId: filters.propiedadId });

    // FILTRO POR ROL
    if (user.role === UserRole.AGENCIA || user.role === UserRole.EMPLEADO) {
      qb.andWhere('agencia.id = :agenciaId', {
        agenciaId: user.agencia?.id || 0,
      });
    }

    return qb.orderBy('op.id', 'DESC').getMany();
  }

async findOne(id: number, user: User) {
  const op = await this.operacionesRepo.findOne({
    where: { id },
    relations: [
      'propiedad',
      'agencia',
      'creadoPor',
      'propietarioDirecto',
      'compradorInquilino'
    ],
  });

  if (!op) throw new NotFoundException('Operación no encontrada');

  if (
    user.role !== UserRole.ADMIN &&
    op.agencia?.id !== user.agencia?.id
  ) {
    throw new ForbiddenException('No tienes permiso para ver esta operación');
  }

  return op;
}

async update(id: number, dto: UpdateOperacionDto, user: User) {
  await this.findOne(id, user);

  await this.operacionesRepo.update(id, dto);

  return this.operacionesRepo.findOne({ where: { id } });
}


  async remove(id: number) {
    const op = await this.operacionesRepo.findOne({ where: { id } });

    if (!op) throw new NotFoundException('Operación no encontrada');

    return this.operacionesRepo.remove(op);
  }

private validarTransicion(actual: OperacionEstado, nuevo: OperacionEstado) {
  const transiciones = {
    [OperacionEstado.PENDIENTE]: [OperacionEstado.RESERVADA, OperacionEstado.CANCELADA],
    [OperacionEstado.RESERVADA]: [OperacionEstado.EN_PROCESO, OperacionEstado.CANCELADA],
    [OperacionEstado.EN_PROCESO]: [OperacionEstado.FINALIZADA, OperacionEstado.CANCELADA],
    [OperacionEstado.FINALIZADA]: [] as OperacionEstado[],
    [OperacionEstado.CANCELADA]: [] as OperacionEstado[],
  };

  return transiciones[actual].includes(nuevo);
}


private async cambiarEstado(id: number, nuevo: OperacionEstado, user: User) {
  const op = await this.findOne(id, user);

  if (!this.validarTransicion(op.estado, nuevo)) {
    throw new ForbiddenException(`No se puede pasar de ${op.estado} a ${nuevo}`);
  }

  // FECHAS AUTOMÁTICAS
  if (nuevo === OperacionEstado.RESERVADA) {
    op.fechaReserva = new Date();
  }

  if (nuevo === OperacionEstado.FINALIZADA) {
    op.fechaFinalizacion = new Date();
  }

  op.estado = nuevo;

  return this.operacionesRepo.save(op);
}

async reservar(id: number, user: User) {
  return this.cambiarEstado(id, OperacionEstado.RESERVADA, user);
}

async procesar(id: number, user: User) {
  return this.cambiarEstado(id, OperacionEstado.EN_PROCESO, user);
}

async finalizarEstado(id: number, user: User) {
  return this.cambiarEstado(id, OperacionEstado.FINALIZADA, user);
}

async cancelar(id: number, user: User) {
  return this.cambiarEstado(id, OperacionEstado.CANCELADA, user);
}

  
}
