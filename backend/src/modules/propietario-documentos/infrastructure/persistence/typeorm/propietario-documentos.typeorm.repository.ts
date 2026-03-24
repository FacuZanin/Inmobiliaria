// backend\src\modules\propietario-documentos\infrastructure\persistence\typeorm\propietario-documentos.typeorm.repository.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { PropietarioDocumentosRepositoryPort } from '../../../application/ports/propietario-documentos-repository.port';
import { PropietarioDocumento as PropietarioDocumentoOrm } from '../../../domain/entities/propietario-documento.domain';
import { Propiedad } from '../../../../propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';
import { User } from '../../../../user/domain/entities/user.entity';
import { PropietarioDocumentoModel } from '../../../domain/entities/propietario-documento.model';
import { Owner } from '../../../domain/entities/owner';
import { toDomain, toOrmPartial } from './propietario-documento.mapper';
import { DocumentoEstado } from '@shared/contracts';

@Injectable()
export class PropietarioDocumentosTypeOrmRepository implements PropietarioDocumentosRepositoryPort {
  constructor(
    @InjectRepository(PropietarioDocumentoOrm)
    private readonly documentosRepo: Repository<PropietarioDocumentoOrm>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Propiedad)
    private readonly propiedadRepo: Repository<Propiedad>,
  ) {}

  async findOwnerById(ownerId: number) {
    const u = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!u) return null;
    return new Owner(u.id, (u as any).nombre ?? null, (u as any).email ?? null);
  }

  async findDocumentoByPropietarioAndTipo(propietarioId: number, tipo: any) {
    const e = await this.documentosRepo.findOne({
      where: { propietario: { id: propietarioId }, tipoDocumento: tipo },
    });
    return e ? toDomain(e) : null;
  }

  async findById(id: number) {
    const e = await this.documentosRepo.findOne({ where: { id } });
    return e ? toDomain(e) : null;
  }

async saveDocumento(doc: Partial<PropietarioDocumentoModel>) {
  try {
    const ormPartial = {
      id: doc.id ?? undefined,
      propietario: doc.propietario
        ? ({ id: doc.propietario.id } as any)
        : undefined,
      propiedadId: doc.propiedadId ?? null,
      tipoDocumento: doc.tipoDocumento,
      archivoUrl: doc.archivoUrl,
      estado: doc.estado ?? DocumentoEstado.PENDIENTE,
      comentarioRechazo: doc.comentarioRechazo ?? null,
      fechaSubida: doc.fechaSubida ?? undefined,
    };

    const entity = this.documentosRepo.create(ormPartial);
    const saved = await this.documentosRepo.save(entity);

    return toDomain(saved);
  } catch (err) {
    console.error('[PropietarioDocumentosRepo.saveDocumento] error', err);
    throw new BadRequestException('Error al guardar documento');
  }
}


  async listByPropietario(propietarioId: number) {
    const list = await this.documentosRepo.find({
      where: { propietario: { id: propietarioId } },
    });
    return list.map(toDomain);
  }

  async findAprobadosByPropietario(propietarioId: number) {
    const list = await this.documentosRepo.find({
      where: {
        propietario: { id: propietarioId },
        estado: DocumentoEstado.APROBADO,
      },
    });
    return list.map(toDomain);
  }
}
