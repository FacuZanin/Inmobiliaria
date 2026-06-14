// backend/src/modules/listings/application/dto/create-listing.dto.ts

import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PropertyType } from '../../domain/enums/property-type.enum';
import { OperationType } from '../../domain/enums/operation-type.enum';

class PricingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  expenses?: number;
}

class LocationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

class FeaturesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bathrooms?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  coveredArea?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalArea?: number;
}

export class CreateListingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  propertyId?: number;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType!: PropertyType;

  @ApiProperty({ enum: OperationType })
  @IsEnum(OperationType)
  operationType!: OperationType;

  @ApiPropertyOptional({ type: PricingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @ApiPropertyOptional({ type: LocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({ type: FeaturesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeaturesDto)
  features?: FeaturesDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}
