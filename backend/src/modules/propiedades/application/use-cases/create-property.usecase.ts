// backend/src/modules/propiedades/application/use-cases/create-property.usecase.ts

// backend/src/modules/propiedades/application/use-cases/create-property.usecase.ts

import {
  Inject,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import type { CreatePropertyDTO } from '../dto/create-property.dto';

import { PropertyAggregate } from '../../domain/entities/property.aggregate';

import { AddressVO } from '../../domain/value-objects/address.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';
import { SuperficieVO } from '../../domain/value-objects/superficie.vo';

import { User } from '@/modules/user/domain/entities/user.entity';

import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

import { PropertyLimitsService } from '@/modules/subscriptions/application/services/property-limits.service';

import { PropertyPublisherPolicy } from '@/shared/security/policies/property-publisher.policy';

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
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,

    private readonly propertyLimitsService: PropertyLimitsService,

    private readonly publisherPolicy: PropertyPublisherPolicy,
  ) {}

  async execute(
    dto: CreatePropertyDTO,
    currentUser: User,
  ): Promise<PropertyAggregate> {
    // =========================================================
    // CONFIGURACIÓN DE PUBLICACIÓN
    // =========================================================

    const requiresAgency =
      this.publisherPolicy.requiresAgency(currentUser);

    const resolvedAgencyId = requiresAgency
      ? (currentUser.agencia?.id ?? null)
      : null;

    // =========================================================
    // VALIDACIONES DE PUBLICACIÓN
    // =========================================================

    if (!this.publisherPolicy.canPublish(currentUser)) {
      throw new ForbiddenException(
        'Tu tipo de cuenta no puede publicar propiedades',
      );
    }

    if (requiresAgency && resolvedAgencyId === null) {
      throw new BadRequestException(
        'El perfil profesional requiere una agencia asociada para publicar',
      );
    }

    // =========================================================
    // LIMITES DEL PLAN
    // =========================================================

    const totalProperties = await this.repo.countByUser(
      currentUser.id,
    );

    const canCreate =
      this.propertyLimitsService.canCreateProperty(
        currentUser.plan,
        totalProperties,
      );

    if (!canCreate) {
      throw new ForbiddenException(
        'Has alcanzado el límite de publicaciones de tu plan actual',
      );
    }

    // =========================================================
    // VALIDACIONES BÁSICAS
    // =========================================================

    if (!dto.direccion) {
      throw new BadRequestException(
        'La dirección es obligatoria',
      );
    }

    if (!dto.operacion) {
      throw new BadRequestException(
        'El tipo de operación es obligatorio',
      );
    }
    // =========================================================
    // VALUE OBJECTS
    // =========================================================

    const direccion = new AddressVO(dto.direccion);

    let precio: PriceVO | null = null;

    if (dto.precioVenta != null) {
      precio = new PriceVO(dto.precioVenta);
    } else if (dto.precioAlquiler != null) {
      precio = new PriceVO(dto.precioAlquiler);
    }

    const superficie =
      dto.metrosCubiertos !== undefined ||
      dto.metrosTotales !== undefined
        ? new SuperficieVO(
            dto.metrosCubiertos ?? null,
            dto.metrosTotales ?? null,
          )
        : null;

    // =========================================================
    // DETALLES
    // =========================================================

    const detalles = this.buildDetails(
      dto.tipo as PropiedadTipo,
      dto.detalles,
    );

    // =========================================================
    // CREACIÓN DE PROPERTY / LISTING
    // =========================================================

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

      creadoPorId: currentUser.id,

      agenciaId: resolvedAgencyId,

      // =====================================================
      // STATUS COMERCIAL
      // =====================================================

      status: PropertyStatus.PUBLICADA,

      // =====================================================
      // STATUS DE MODERACIÓN / VALIDACIÓN
      // =====================================================

      moderationStatus: PublicacionStatus.EN_REVISION,
    });

    // =========================================================
    // GUARDAR
    // =========================================================

    return this.repo.save(property);
  }

  // ===========================================================
  // DETAILS FACTORY
  // ===========================================================

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