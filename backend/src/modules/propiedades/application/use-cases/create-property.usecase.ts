// backend\src\modules\propiedades\application\use-cases\create-property.usecase.ts

import {
  Inject,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import type { CreatePropertyDTO } from '../dto/create-property.dto';
import type { DocsCheckerPort } from '../ports/docs-checker.port';

import { PropertyAggregate } from '../../domain/entities/property.aggregate';
import { AddressVO } from '../../domain/value-objects/address.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';
import { SuperficieVO } from '../../domain/value-objects/superficie.vo';

import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

import { PROPERTY_REPOSITORY, DOCS_CHECKER } from '../tokens';

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
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,

    @Inject(DOCS_CHECKER)
    private readonly docsChecker: DocsCheckerPort,
  ) {}

  async execute(
    dto: CreatePropertyDTO,
    currentUserId: number,
  ): Promise<PropertyAggregate> {
    const ownerId = dto.propietarioId ?? currentUserId;

    const docs = await this.docsChecker.hasApprovedDocs(ownerId);
    if (!docs.dni || !docs.escritura) {
      throw new ForbiddenException(
        'El propietario no tiene la documentación aprobada',
      );
    }

    if (!dto.direccion) {
      throw new BadRequestException('La dirección es obligatoria');
    }

    if (!dto.operacion) {
      throw new BadRequestException('El tipo de operación es obligatorio');
    }

    const direccion = new AddressVO(dto.direccion);

    let precio: PriceVO | null = null;
    if (dto.precioVenta != null) {
      precio = new PriceVO(dto.precioVenta);
    } else if (dto.precioAlquiler != null) {
      precio = new PriceVO(dto.precioAlquiler);
    }

    const superficie =
      dto.metrosCubiertos !== undefined || dto.metrosTotales !== undefined
        ? new SuperficieVO(
            dto.metrosCubiertos ?? null,
            dto.metrosTotales ?? null,
          )
        : null;

    const detalles = this.buildDetails(
      dto.tipo as PropiedadTipo,
      dto.detalles,
    );

    const property = PropertyAggregate.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? null,
      tipo: dto.tipo as PropiedadTipo,
      operacion: dto.operacion as OperacionTipo,

      direccion,
      localidad: dto.localidad ?? '',
      precio,
      superficie,

      detalles,
      imagenes: dto.imagenes ?? [],

      creadoPorId: ownerId,
      agenciaId: dto.agenciaId ?? null,
    });

    return this.repo.save(property);
  }

  // 🔧 Helper privado (Application layer)
  private buildDetails(
    tipo: PropiedadTipo,
    detalles?: Record<string, any>,
  ) {
    if (!detalles) return undefined;

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
