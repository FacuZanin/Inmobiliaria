import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import { ListingStatus } from '@/modules/listings/domain/enums/listing-status.enum';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';
import { PROPERTY_REPOSITORY } from '@/modules/properties/application/tokens';
import type { PropertyRepositoryPort } from '@/modules/properties/domain/repositories/property.repository.port';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';
import { OperationEntity } from '@/modules/operaciones/domain/entities/operation.entity';
import { OperationRepositoryPort } from '@/modules/operaciones/domain/repositories/operation.repository.port';
import { OPERATION_REPOSITORY } from '../tokens';
import { CreateOperationDto } from '../dto/create-operation.dto';
import { OperationTypeMapperService } from '../services/operation-type-mapper.service';

@Injectable()
export class CreateOperationUseCase {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepository: OperationRepositoryPort,

    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepositoryPort,

    private readonly typeMapper: OperationTypeMapperService,
  ) {}

  async execute(dto: CreateOperationDto, buyerId: number) {
    if (dto.listingId) {
      return this.createFromListing(dto, buyerId);
    }

    if (dto.propertyId) {
      return this.createFromProperty(dto, buyerId);
    }

    throw new NotFoundException('Listing or property is required');
  }

  private async createFromListing(dto: CreateOperationDto, buyerId: number) {
    const listing = await this.listingRepository.findById(dto.listingId!);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new ConflictException('Only active listings can receive operations');
    }

    const operation = OperationEntity.create({
      type: this.typeMapper.fromListing(listing.operationType),
      listingId: listing.id,
      propertyId: listing.propertyId,
      buyerId,
      ownerId: listing.ownerId,
      agencyId: listing.agencyId,
      amount: dto.amount ?? this.resolveListingAmount(listing),
      currency: dto.currency ?? 'ARS',
      message: dto.message ?? null,
    });

    return this.operationRepository.save(operation);
  }

  private async createFromProperty(dto: CreateOperationDto, buyerId: number) {
    const property = await this.propertyRepository.findById(dto.propertyId!);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PUBLICADA) {
      throw new ConflictException('Only published properties can receive operations');
    }

    const operation = OperationEntity.create({
      type: this.typeMapper.fromProperty(property.operationType),
      listingId: null,
      propertyId: property.id,
      buyerId,
      ownerId: property.ownerId,
      agencyId: property.agencyId,
      amount: dto.amount ?? this.resolvePropertyAmount(property),
      currency: dto.currency ?? property.pricing.currency,
      message: dto.message ?? null,
    });

    return this.operationRepository.save(operation);
  }

  private resolveListingAmount(listing: {
    operationType: { toString(): string };
    pricing: { salePrice: number | null; rentalPrice: number | null };
  }) {
    return listing.pricing.salePrice ?? listing.pricing.rentalPrice;
  }

  private resolvePropertyAmount(property: {
    pricing: { salePrice: number | null; rentalPrice: number | null };
  }) {
    return property.pricing.salePrice ?? property.pricing.rentalPrice;
  }
}
