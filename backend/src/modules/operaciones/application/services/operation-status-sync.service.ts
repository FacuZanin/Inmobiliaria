import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';
import { PROPERTY_REPOSITORY } from '@/modules/properties/application/tokens';
import type { PropertyRepositoryPort } from '@/modules/properties/domain/repositories/property.repository.port';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';
import { OperationEntity } from '@/modules/operaciones/domain/entities/operation.entity';
import { RealEstateOperationType } from '@/modules/operaciones/domain/enums/real-estate-operation-type.enum';

@Injectable()
export class OperationStatusSyncService {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,
  ) {}

  async reserve(operation: OperationEntity) {
    const listing = operation.listingId
      ? await this.listingRepository.findById(operation.listingId)
      : null;

    if (operation.listingId && !listing) {
      throw new NotFoundException('Listing not found');
    }

    const property = operation.propertyId
      ? await this.propertyRepository.findById(operation.propertyId)
      : null;

    if (operation.propertyId && !property) {
      throw new NotFoundException('Property not found');
    }

    if (listing) {
      listing.reserve();
      await this.listingRepository.update(operation.listingId!, listing);
    }

    if (property) {
      property.changeStatus(PropertyStatus.RESERVADA);
      await this.propertyRepository.update(operation.propertyId!, property);
    }
  }

  async finalize(operation: OperationEntity) {
    const listing = operation.listingId
      ? await this.listingRepository.findById(operation.listingId)
      : null;
    const property = operation.propertyId
      ? await this.propertyRepository.findById(operation.propertyId)
      : null;

    if (listing) {
      if (operation.type === RealEstateOperationType.SALE) {
        listing.markAsSold();
      } else {
        listing.markAsRented();
      }

      await this.listingRepository.update(operation.listingId!, listing);
    }

    if (property) {
      property.changeStatus(
        operation.type === RealEstateOperationType.SALE
          ? PropertyStatus.VENDIDA
          : PropertyStatus.ALQUILADA,
      );
      await this.propertyRepository.update(operation.propertyId!, property);
    }
  }

  async cancel(operation: OperationEntity) {
    const listing = operation.listingId
      ? await this.listingRepository.findById(operation.listingId)
      : null;
    const property = operation.propertyId
      ? await this.propertyRepository.findById(operation.propertyId)
      : null;

    if (listing) {
      listing.releaseReservation();
      await this.listingRepository.update(operation.listingId!, listing);
    }

    if (property && property.status === PropertyStatus.RESERVADA) {
      property.changeStatus(PropertyStatus.PUBLICADA);
      await this.propertyRepository.update(operation.propertyId!, property);
    }
  }
}
