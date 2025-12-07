import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { DocumentoEstado } from '../common/enums/documento-estado.enum';

import {
  DocumentoAudit,
  DocumentoAuditAction,
} from './entities/documento-audit.entity';

import { PropietarioDocumento } from '../propietario-documentos/entities/propietario-documento.entity';
import { InquilinoDocumento } from '../inquilino-documentos/entities/inquilino-documento.entity';

import { FiltroDocumentosDto } from './dto/filtro-documentos.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Injectable()
export class AdminDocumentosService {
  constructor(
    @InjectRepository(PropietarioDocumento)
    private readonly propietarioDocsRepo: Repository<PropietarioDocumento>,

    @InjectRepository(InquilinoDocumento)
    private readonly inquilinoDocsRepo: Repository<InquilinoDocumento>,

    @InjectRepository(DocumentoAudit)
    private readonly auditRepo: Repository<DocumentoAudit>,
  ) {}

  private buildQuery(
    qb: SelectQueryBuilder<any>,
    filters: FiltroDocumentosDto,
  ): SelectQueryBuilder<any> {
    qb.leftJoinAndSelect('doc.propiedad', 'propiedad')
      .leftJoinAndSelect('doc.propietario', 'propietario')
      .leftJoinAndSelect('doc.inquilino', 'inquilino');

    if (filters.estado) {
      qb.andWhere('doc.estado = :estado', { estado: filters.estado });
    }

    if (filters.tipoDocumento) {
      qb.andWhere('doc.tipoDocumento = :td', { td: filters.tipoDocumento });
    }

    if (filters.propiedadId) {
      qb.andWhere('propiedad.id = :pid', { pid: filters.propiedadId });
    }

    if (filters.propiedadTipo) {
      qb.andWhere('propiedad.tipo = :pty', { pty: filters.propiedadTipo });
    }

    if (filters.localidad) {
      qb.andWhere('propiedad.localidad ILIKE :loc', {
        loc: `%${filters.localidad}%`,
      });
    }

    if (filters.usuarioBusqueda) {
      qb.andWhere(
        `(propietario.nombre ILIKE :q OR propietario.email ILIKE :q 
          OR inquilino.nombre ILIKE :q OR inquilino.email ILIKE :q)`,
        { q: `%${filters.usuarioBusqueda}%` },
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;

    qb.skip((page - 1) * limit);
    qb.take(limit);

    return qb;
  }

  async listarDocumentos(filters: FiltroDocumentosDto) {
    let docs: any[] = [];
    let total = 0;

    if (!filters.documentoTipo || filters.documentoTipo === 'PROPIETARIO') {
      const qb = this.propietarioDocsRepo.createQueryBuilder('doc');
      const query = this.buildQuery(qb, filters);

      const [items, count] = await query.getManyAndCount();

      docs.push(...items.map((d) => ({ ...d, documentoTipo: 'PROPIETARIO' })));
      total += count;
    }

    if (!filters.documentoTipo || filters.documentoTipo === 'INQUILINO') {
      const qb = this.inquilinoDocsRepo.createQueryBuilder('doc');
      const query = this.buildQuery(qb, filters);

      const [items, count] = await query.getManyAndCount();

      docs.push(...items.map((d) => ({ ...d, documentoTipo: 'INQUILINO' })));
      total += count;
    }

    return { total, docs };
  }

  async cambiarEstado(
    tipo: 'INQUILINO' | 'PROPIETARIO',
    id: number,
    dto: CambiarEstadoDto,
    userId: number,
  ) {
    if (tipo === 'INQUILINO') {
      const doc = await this.inquilinoDocsRepo.findOne({ where: { id } });
      if (!doc) throw new NotFoundException('Documento no encontrado');

      doc.estado = dto.estado;
      doc.comentarioRechazo = dto.comentarioRechazo ?? null;
      await this.inquilinoDocsRepo.save(doc);

      await this.registrarAudit({
        documentoId: id,
        documentoTipo: tipo,
action:
  dto.estado === DocumentoEstado.APROBADO
    ? DocumentoAuditAction.APROBADO
    : dto.estado === DocumentoEstado.RECHAZADO
      ? DocumentoAuditAction.RECHAZADO
      : DocumentoAuditAction.EN_ANALISIS,

        comentario: dto.comentarioRechazo || null,
        userId,
      });

      return doc;
    } else {
      const doc = await this.propietarioDocsRepo.findOne({ where: { id } });
      if (!doc) throw new NotFoundException('Documento no encontrado');

      doc.estado = dto.estado;
      doc.comentarioRechazo = dto.comentarioRechazo ?? null;
      await this.propietarioDocsRepo.save(doc);

      await this.registrarAudit({
        documentoId: id,
        documentoTipo: tipo,
        action:
          dto.estado === 'APROBADO'
            ? DocumentoAuditAction.APROBADO
            : DocumentoAuditAction.RECHAZADO,
        comentario: dto.comentarioRechazo || null,
        userId,
      });

      return doc;
    }
  }

  async verHistorial(documentoId: number, tipo: 'INQUILINO' | 'PROPIETARIO') {
    return this.auditRepo.find({
      where: { documentoId, documentoTipo: tipo },
      order: { createdAt: 'DESC' },
    });
  }

  private async registrarAudit(data: {
    documentoId: number;
    documentoTipo: 'INQUILINO' | 'PROPIETARIO';
    action: DocumentoAuditAction;
    userId: number;
    comentario?: string | null;
    analisisIA?: any;
    datosExtras?: any;
  }) {
    await this.auditRepo.save({
      documentoId: data.documentoId,
      documentoTipo: data.documentoTipo,
      action: data.action,
      performedById: data.userId,
      comentario: data.comentario ?? null,
      analisisIA: data.analisisIA ?? null,
      datosExtras: data.datosExtras ?? null,
    });
  }
}
