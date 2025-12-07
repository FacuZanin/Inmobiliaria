// backend/src/inquilinos/inquilinos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inquilino } from './entities/inquilino.entity';
import { SolicitudVisita } from './entities/solicitud-visita.entity';
import { Favorito } from './entities/favorito.entity';
import { CrearSolicitudVisitaDto } from './dto/crear-solicitud-visita.dto';
import { User } from '../users/user.entity/user.entity';
import { Propiedad } from '../propiedades/entities/propiedad.entity';
import { ActualizarPerfilInquilinoDto } from './dto/actualizar-perfil.dto';

@Injectable()
export class InquilinosService {
  constructor(
    @InjectRepository(Inquilino)
    private inquilinoRepo: Repository<Inquilino>,

    @InjectRepository(SolicitudVisita)
    private visitasRepo: Repository<SolicitudVisita>,

    @InjectRepository(Favorito)
    private favoritosRepo: Repository<Favorito>,

    @InjectRepository(Propiedad)
    private propiedadRepo: Repository<Propiedad>,
  ) {}

  async getPerfil(userId: number) {
    return this.inquilinoRepo.findOne({
      where: { user: { id: userId } },
      relations: ['favoritos', 'solicitudesVisita'],
    });
  }

  async crearSolicitudVisita(dto: CrearSolicitudVisitaDto, user: User) {
    const inquilino = await this.inquilinoRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!inquilino) throw new NotFoundException('El usuario no es inquilino');

    const propiedad = await this.propiedadRepo.findOne({
      where: { id: dto.propiedadId },
    });

    if (!propiedad) throw new NotFoundException('Propiedad no encontrada');

    const visita = this.visitasRepo.create({
      inquilino,
      propiedad,
      mensaje: dto.mensaje,
      fechaDeseada: new Date(dto.fechaDeseada),
    });

    return this.visitasRepo.save(visita);
  }

  async agregarFavorito(propiedadId: number, user: User) {
    const inquilino = await this.inquilinoRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!inquilino) throw new NotFoundException('El usuario no es inquilino');

    const propiedad = await this.propiedadRepo.findOne({
      where: { id: propiedadId },
    });

    if (!propiedad) throw new NotFoundException('Propiedad no encontrada');

    const favorito = this.favoritosRepo.create({
      inquilino,
      propiedad,
    });

    return this.favoritosRepo.save(favorito);
  }

  async eliminarFavorito(id: number, user: User) {
    return this.favoritosRepo.delete(id);
  }

  async listarFavoritos(user: User) {
    const inquilino = await this.inquilinoRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['favoritos', 'favoritos.propiedad'],
    });

    return inquilino?.favoritos ?? [];
  }

  async actualizarPerfil(userId: number, dto: ActualizarPerfilInquilinoDto) {
  const inquilino = await this.inquilinoRepo.findOne({
    where: { user: { id: userId } },
  });

  if (!inquilino) throw new NotFoundException('El usuario no es inquilino');

  Object.assign(inquilino, dto);

  return this.inquilinoRepo.save(inquilino);
}

}
