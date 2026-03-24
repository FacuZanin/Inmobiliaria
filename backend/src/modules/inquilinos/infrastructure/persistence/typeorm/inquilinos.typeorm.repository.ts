// backend\src\modules\inquilinos\infrastructure\persistence\typeorm\inquilinos.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { InquilinosRepositoryPort } from '../../../application/ports/inquilinos-repository.port';

import { Inquilino } from '../../../domain/entities/inquilino.entity';
import { SolicitudVisita } from '../../../domain/entities/solicitud-visita.entity';
import { Favorito } from '../../../domain/entities/favorito.entity';

@Injectable()
export class InquilinosTypeOrmRepository implements InquilinosRepositoryPort {
  constructor(
    @InjectRepository(Inquilino)
    private readonly inquilinoRepo: Repository<Inquilino>,

    @InjectRepository(SolicitudVisita)
    private readonly visitasRepo: Repository<SolicitudVisita>,

    @InjectRepository(Favorito)
    private readonly favoritosRepo: Repository<Favorito>,
  ) {}

  async findByUserId(userId: number) {
    return this.inquilinoRepo.findOne({
      where: { userId },
      relations: ['favoritos', 'solicitudesVisita'],
    });
  }

  async save(inquilino: Inquilino) {
    return this.inquilinoRepo.save(inquilino);
  }

  async createVisita(data: Partial<SolicitudVisita>) {
    return this.visitasRepo.create(data);
  }

  async saveVisita(visita: SolicitudVisita) {
    return this.visitasRepo.save(visita);
  }

  async createFavorito(data: Partial<Favorito>) {
    return this.favoritosRepo.create(data);
  }

  async saveFavorito(fav: Favorito) {
    return this.favoritosRepo.save(fav);
  }

  async deleteFavorito(id: number) {
    return this.favoritosRepo.delete(id);
  }

  async listFavoritosByUser(userId: number) {
    const inquilino = await this.inquilinoRepo.findOne({
      where: { userId },
      relations: ['favoritos'],
    });

    return inquilino?.favoritos ?? [];
  }
}
