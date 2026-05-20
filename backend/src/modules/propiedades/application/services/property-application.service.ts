// backend\src\modules\propiedades\application\services\property-application.service.ts
import { Injectable, Inject }
  from '@nestjs/common';

import { QueryRunner }
  from 'typeorm';

import { PropertyAggregate }
  from '../../domain/entities/property.aggregate';

import { PropertyRepositoryPort }
  from '../ports/property-repository.port';

import { AddressVO }
  from '../../domain/value-objects/address.vo';

import { PriceVO }
  from '../../domain/value-objects/price.vo';

import { PropertyStatus }
  from '@shared/contracts/enums/property-status.enum';

@Injectable()
export class PropertyApplicationService {
  constructor(
    @Inject('PropertyRepositoryPort')
    private readonly propertyRepository:
      PropertyRepositoryPort,
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

    const address =
      AddressVO.create({
        direccion:
          dto.direccion,
      });

    const price =
      PriceVO.create(
        dto.precio,
      );

    // ---------------------------------------------------
    // AGGREGATE
    // ---------------------------------------------------

    const property =
      PropertyAggregate.create({
        titulo:
          dto.titulo,

        descripcion:
          dto.descripcion,

        tipo:
          dto.tipoPropiedad,

        operacion:
          dto.tipoOperacion,

        status:
          PropertyStatus.PUBLICADA,

        precio: price,

        direccion: address,

        localidad:
          dto.localidad ??
          'Sin localidad',

        creadoPorId:
          userId,

        imagenes: [],

        ambientes:
          dto.ambientes,

        dormitorios:
          dto.dormitorios,

        banos:
          dto.banos,
      });

    // ---------------------------------------------------
    // PERSISTENCIA
    // ---------------------------------------------------

    const saved =
      await this.propertyRepository
        .save(property);

    return saved;
  }
}