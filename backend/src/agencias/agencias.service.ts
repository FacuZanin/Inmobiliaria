import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agencia } from './entities/agencia.entity';
import { CreateAgenciaDto } from './dto/create-agencia.dto';
import { UpdateAgenciaDto } from './dto/update-agencia.dto';
import { AgenciaSolicitud } from './entities/agencia-solicitud.entity';
import { SolicitudAgenciaDto } from './dto/solicitud-agencia.dto';
import { User } from '../users/user.entity/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class AgenciasService {
  constructor(
    @InjectRepository(Agencia)
    private readonly agenciaRepo: Repository<Agencia>,
    @InjectRepository(AgenciaSolicitud)
    private readonly solicitudRepo: Repository<AgenciaSolicitud>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.agenciaRepo.find();
  }

  async findOne(id: number) {
    const agencia = await this.agenciaRepo.findOne({ where: { id } });
    if (!agencia) throw new NotFoundException('Agencia no encontrada');
    return agencia;
  }

  create(dto: CreateAgenciaDto) {
    const agencia = this.agenciaRepo.create(dto);
    return this.agenciaRepo.save(agencia);
  }

  async update(id: number, dto: UpdateAgenciaDto) {
    const agencia = await this.findOne(id);
    Object.assign(agencia, dto);
    return this.agenciaRepo.save(agencia);
  }

  async remove(id: number) {
    const agencia = await this.findOne(id);
    return this.agenciaRepo.remove(agencia);
  }

async crearSolicitud(dto: SolicitudAgenciaDto, usuario: User) {
  const solicitud = this.solicitudRepo.create({
    ...dto,
    usuario,
  });

  return this.solicitudRepo.save(solicitud);
}

async findSolicitudesPendientes() {
  return this.solicitudRepo.find({
    where: { estado: 'PENDIENTE' },
    order: { creadaEn: 'DESC' },
  });
}

async findSolicitud(id: number) {
  const solicitud = await this.solicitudRepo.findOne({
    where: { id },
  });

  if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

  return solicitud;
}

async aprobarSolicitud(id: number) {
  const solicitud = await this.findSolicitud(id);

  if (solicitud.estado !== 'PENDIENTE') {
    throw new BadRequestException('La solicitud ya fue procesada');
  }

  const agencia = this.agenciaRepo.create({
    nombre: `${solicitud.nombreTitular} Inmobiliaria`,
    direccion: '---',
    localidad: solicitud.provincia,
    email: solicitud.usuario.email,
    telefono: solicitud.usuario.telefono || '',
  });

  const nuevaAgencia = await this.agenciaRepo.save(agencia);

  solicitud.usuario.role = UserRole.AGENCIA;
  solicitud.usuario.agencia = nuevaAgencia;
  await this.userRepo.save(solicitud.usuario);

  solicitud.estado = 'APROBADA';
  return this.solicitudRepo.save(solicitud);
}

async rechazarSolicitud(id: number) {
  const solicitud = await this.findSolicitud(id);

  if (solicitud.estado !== 'PENDIENTE') {
    throw new BadRequestException('La solicitud ya fue procesada');
  }

  solicitud.estado = 'RECHAZADA';
  return this.solicitudRepo.save(solicitud);
}

}
