import { Injectable } from '@nestjs/common';
import { OperationType as ListingOperationType } from '@/modules/listings/domain/enums/operation-type.enum';
import { RealEstateOperationType } from '@/modules/operaciones/domain/enums/real-estate-operation-type.enum';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';

@Injectable()
export class OperationTypeMapperService {
  fromListing(type: ListingOperationType): RealEstateOperationType {
    const map: Record<ListingOperationType, RealEstateOperationType> = {
      [ListingOperationType.SALE]: RealEstateOperationType.SALE,
      [ListingOperationType.RENT]: RealEstateOperationType.RENT,
      [ListingOperationType.TEMPORARY_RENT]: RealEstateOperationType.TEMPORARY_RENT,
    };

    return map[type];
  }

  fromProperty(type: OperacionTipo): RealEstateOperationType {
    const map: Record<OperacionTipo, RealEstateOperationType> = {
      [OperacionTipo.VENTA]: RealEstateOperationType.SALE,
      [OperacionTipo.ALQUILER]: RealEstateOperationType.RENT,
      [OperacionTipo.TEMPORAL]: RealEstateOperationType.TEMPORARY_RENT,
    };

    return map[type];
  }
}
