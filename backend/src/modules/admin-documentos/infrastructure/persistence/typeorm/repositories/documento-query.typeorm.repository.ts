// backend\src\modules\admin-documentos\infrastructure\persistence\typeorm\repositories\documento-query.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import type { DocumentoQueryPort } from '../../../../application/ports/documento-query.port';
import { FiltroDocumentosDto } from '../../../../application/dto/filtro-documentos.dto';

import { PropietarioDocumento } from '../../../../../propietario-documentos/domain/entities/propietario-documento.domain';
import { InquilinoDocumento } from '../../../../../inquilino-documentos/domain/entities/inquilino-documento.entity';

@Injectable()
export class DocumentoQueryTypeOrmRepository implements DocumentoQueryPort {
  constructor(
    @InjectRepository(PropietarioDocumento)
    private readonly propietarioRepo: Repository<PropietarioDocumento>,

    @InjectRepository(InquilinoDocumento)
    private readonly inquilinoRepo: Repository<InquilinoDocumento>,
  ) {}

  async listar(filtros: FiltroDocumentosDto) {
    let docs: any[] = [];
    let total = 0;

    if (!filtros.documentoTipo || filtros.documentoTipo === 'PROPIETARIO') {
      const qb = this.propietarioRepo.createQueryBuilder('doc');
      const query = this.applyFilters(qb, filtros);
      const [items, count] = await query.getManyAndCount();

      docs.push(...items.map(d => ({ ...d, documentoTipo: 'PROPIETARIO' })));
      total += count;
    }

    if (!filtros.documentoTipo || filtros.documentoTipo === 'INQUILINO') {
      const qb = this.inquilinoRepo.createQueryBuilder('doc');
      const query = this.applyFilters(qb, filtros);
      const [items, count] = await query.getManyAndCount();

      docs.push(...items.map(d => ({ ...d, documentoTipo: 'INQUILINO' })));
      total += count;
    }

    return { total, docs };
  }

  private applyFilters(
    qb: SelectQueryBuilder<any>,
    filtros: FiltroDocumentosDto,
  ) {
    qb.leftJoinAndSelect('doc.propiedad', 'propiedad')
      .leftJoinAndSelect('doc.propietario', 'propietario')
      .leftJoinAndSelect('doc.inquilino', 'inquilino');

    if (filtros.estado) {
      qb.andWhere('doc.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.tipoDocumento) {
      qb.andWhere('doc.tipoDocumento = :td', { td: filtros.tipoDocumento });
    }

    if (filtros.propiedadId) {
      qb.andWhere('propiedad.id = :pid', { pid: filtros.propiedadId });
    }

    if (filtros.propiedadTipo) {
      qb.andWhere('propiedad.tipo = :pty', { pty: filtros.propiedadTipo });
    }

    if (filtros.localidad) {
      qb.andWhere('propiedad.localidad ILIKE :loc', {
        loc: `%${filtros.localidad}%`,
      });
    }

    if (filtros.usuarioBusqueda) {
      qb.andWhere(
        `(propietario.nombre ILIKE :q OR propietario.email ILIKE :q
          OR inquilino.nombre ILIKE :q OR inquilino.email ILIKE :q)`,
        { q: `%${filtros.usuarioBusqueda}%` },
      );
    }

    const page = filtros.page || 1;
    const limit = filtros.limit || 20;

    qb.skip((page - 1) * limit);
    qb.take(limit);

    return qb;
  }
}
