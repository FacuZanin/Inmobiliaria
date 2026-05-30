// backend/src/modules/listings/application/dto/create-listing.dto.ts

import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
} from 'class-validator';

import { PropertyType } from '../../domain/enums/property-type.enum';

import { OperationType } from '../../domain/enums/operation-type.enum';

export class CreateListingDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PropertyType)
  propertyType!: PropertyType;

  @IsEnum(OperationType)
  operationType!: OperationType;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsNumber()
  rentalPrice?: number;

  @IsOptional()
  @IsNumber()
  expenses?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  rooms?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  coveredArea?: number;

  @IsOptional()
  @IsNumber()
  totalArea?: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}