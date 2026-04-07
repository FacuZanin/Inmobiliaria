// backend\src\modules\propiedades\application\use-cases\update-property.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import type { UpdatePropertyDTO } from '../dto/update-property.dto';

import { PropertyAggregate } from '../../domain/entities/property.aggregate';
import { AddressVO } from '../../domain/value-objects/address.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';
import { SuperficieVO } from '../../domain/value-objects/superficie.vo';

import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

import { PROPERTY_REPOSITORY } from '../tokens';

import {
  CasaDetails,
  DepartamentoDetails,
  LoteDetails,
  LocalDetails,
  OficinaDetails,
  CampoDetails,
  PHDetails,
  PozoDetails,
} from '../../domain/details';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(
    id: number,
    dto: UpdatePropertyDTO,
  ): Promise<PropertyAggregate> {
    const property = await this.repo.findById(id);
    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    // 1️⃣ Update generales
    property.updateGeneral({
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? null,
      operacion: dto.operacion as OperacionTipo,
      direccion: dto.direccion ? new AddressVO(dto.direccion) : undefined,
      localidad: dto.localidad,
      imagenes: dto.imagenes,
      ambientes: dto.ambientes,
      dormitorios: dto.dormitorios,
      banos: dto.banos,
      agenciaId: dto.agenciaId ?? null,
      superficie:
        dto.metrosCubiertos !== undefined || dto.metrosTotales !== undefined
          ? new SuperficieVO(
              dto.metrosCubiertos ?? null,
              dto.metrosTotales ?? null,
            )
          : undefined,
      precio:
        dto.precioVenta ?? dto.precioAlquiler
          ? new PriceVO(dto.precioVenta ?? dto.precioAlquiler!)
          : undefined,
    });

    // 2️⃣ Update detalles
    if (dto.detalles) {
      const detalles = this.buildDetails(
        property.tipo as PropiedadTipo,
        dto.detalles,
      );
      if (detalles) {
        property.setDetalles(detalles);
      }
    }

    // 3️⃣ Persistir
    return (await this.repo.update(id, property))!;
  }

  private buildDetails(tipo: PropiedadTipo, detalles: Record<string, any>) {
    switch (tipo) {
      case PropiedadTipo.CASA:
        return new CasaDetails(
          detalles.antiguedad,
          detalles.garage,
          detalles.patio,
          detalles.quincho,
          detalles.pileta,
          detalles.superficieTerreno,
          detalles.superficieConstruida,
        );
      case PropiedadTipo.DEPARTAMENTO:
        return new DepartamentoDetails(
          detalles.piso,
          detalles.unidad,
          detalles.ascensor,
          detalles.expensas,
          detalles.superficieBalcon,
          detalles.cochera,
        );
      case PropiedadTipo.LOTE:
        return new LoteDetails(
          detalles.superficieTotal,
          detalles.frente,
          detalles.fondo,
          detalles.zonificacion,
        );
      case PropiedadTipo.LOCAL:
        return new LocalDetails(
          detalles.vidrieraMetros,
          detalles.deposito,
          detalles.banos,
          detalles.aptoGastronomico,
          detalles.luzTrifasica,
        );
      case PropiedadTipo.OFICINA:
        return new OficinaDetails(
          detalles.puestos,
          detalles.salaReuniones,
          detalles.kitchenette,
          detalles.banos,
          detalles.expensas,
        );
      case PropiedadTipo.CAMPO:
        return new CampoDetails(
          detalles.hectareas,
          detalles.apto,
          detalles.mejoras,
        );
      case PropiedadTipo.PH:
        return new PHDetails(
          detalles.porcentajeLote,
          detalles.entradaIndividual,
          detalles.patio,
          detalles.expensas,
        );
      case PropiedadTipo.POZO:
        return new PozoDetails(
          detalles.fechaEntrega,
          detalles.avancePorcentaje,
          detalles.tipologias,
          detalles.constructora,
        );
      default:
        return undefined;
    }
  }
}
