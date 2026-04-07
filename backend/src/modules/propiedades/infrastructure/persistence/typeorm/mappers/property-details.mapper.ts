// backend\src\modules\propiedades\infrastructure\persistence\typeorm\mappers\property-details.mapper.ts
import { Propiedad } from '../entities/propiedad.entity';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

import {
  CasaDetails,
  DepartamentoDetails,
  LoteDetails,
  LocalDetails,
  OficinaDetails,
  CampoDetails,
  CampoApto,
  PHDetails,
  PozoDetails,
} from '../../../../domain/details/index';

import type { PropertyDetails } from '../../../../domain/entities/property.aggregate';

export class PropertyDetailsMapper {
  /**
   * ORM Entity -> Domain Details
   */
  static fromEntity(entity: Propiedad): PropertyDetails | undefined {
    switch (entity.tipo) {
      case PropiedadTipo.CASA:
        if (!entity.casa) return undefined;
        return new CasaDetails(
          entity.casa.antiguedad,
          entity.casa.garage,
          entity.casa.patio,
          entity.casa.quincho,
          entity.casa.pileta,
          entity.casa.superficieTerreno,
          entity.casa.superficieConstruida,
        );

      case PropiedadTipo.DEPARTAMENTO:
        if (!entity.departamento) return undefined;
        return new DepartamentoDetails(
          entity.departamento.piso,
          entity.departamento.unidad,
          entity.departamento.ascensor,
          entity.departamento.expensas,
          entity.departamento.superficieBalcon,
          entity.departamento.cochera,
        );

      case PropiedadTipo.LOTE:
        if (!entity.lote) return undefined;
        return new LoteDetails(
          entity.lote.superficieTotal,
          entity.lote.frente,
          entity.lote.fondo,
          entity.lote.zonificacion,
        );

      case PropiedadTipo.LOCAL:
        if (!entity.local) return undefined;
        return new LocalDetails(
          entity.local.vidrieraMetros,
          entity.local.deposito,
          entity.local.banos,
          entity.local.aptoGastronomico,
          entity.local.luzTrifasica,
        );

      case PropiedadTipo.OFICINA:
        if (!entity.oficina) return undefined;
        return new OficinaDetails(
          entity.oficina.puestos,
          entity.oficina.salaReuniones,
          entity.oficina.kitchenette,
          entity.oficina.banos,
          entity.oficina.expensas,
        );

      case PropiedadTipo.CAMPO:
        if (!entity.campo) return undefined;
        return new CampoDetails(
          entity.campo.hectareas,
          entity.campo.apto
            ? (entity.campo.apto.toUpperCase() as CampoApto)
            : null,
          entity.campo.mejoras,
        );

      case PropiedadTipo.PH:
        if (!entity.ph) return undefined;
        return new PHDetails(
          entity.ph.porcentajeLote,
          entity.ph.entradaIndividual,
          entity.ph.patio,
          entity.ph.expensas,
        );

      case PropiedadTipo.POZO:
        if (!entity.pozo) return undefined;
        return new PozoDetails(
          entity.pozo.fechaEntrega,
          entity.pozo.avancePorcentaje,
          entity.pozo.tipologias,
          entity.pozo.constructora,
        );

      default:
        return undefined;
    }
  }

  /**
   * Domain Details -> ORM fragment
   * (usado por el repository al persistir)
   */
  static toOrm(
    detalles: PropertyDetails | undefined,
    propiedad: Propiedad,
  ): object | null {
    if (!detalles) return null;

    return {
      ...detalles,
      propiedad,
    };
  }
}
