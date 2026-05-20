// backend\src\modules\propiedades\application\services\property-application.service.ts
import { Injectable, Inject } from '@nestjs/common';

import { QueryRunner } from 'typeorm';

import { PropertyAggregate } from '../../domain/entities/property.aggregate';

import { PropertyRepositoryPort } from '../ports/property-repository.port';

import { PROPERTY_REPOSITORY } from '../tokens';

import { AddressVO } from '../../domain/value-objects/address.vo';
import { PriceVO } from '../../domain/value-objects/price.vo';

import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

@Injectable()
export class PropertyApplicationService {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}

  async create({
    dto,
    userId,
    queryRunner,
  }: {
    dto: any;

    userId: number;

    queryRunner?: QueryRunner;
  }) {
    // ---------------------------------------------------
    // VALUE OBJECTS
    // ---------------------------------------------------

    const address = new AddressVO(dto.direccion);

    const price = new PriceVO(Number(dto.precio));

    // ---------------------------------------------------
    // AGGREGATE
    // ---------------------------------------------------

    const property = PropertyAggregate.create({
      titulo: dto.titulo,

      descripcion: dto.descripcion,

      tipo: dto.tipoPropiedad?.toUpperCase(),

      operacion: dto.tipoOperacion?.toUpperCase(),

      status: PropertyStatus.PUBLICADA,

      precio: price,

      direccion: address,

      localidad: dto.localidad ?? 'Sin localidad',

      creadoPorId: userId,

      imagenes: [],

      ambientes: dto.ambientes ? Number(dto.ambientes) : undefined,

      dormitorios: dto.dormitorios ? Number(dto.dormitorios) : undefined,

      banos: dto.banos ? Number(dto.banos) : undefined,
    });

    // ---------------------------------------------------
    // PERSISTENCIA
    // ---------------------------------------------------

    const saved = await this.propertyRepository.save(property);

    return saved;
  }
}
