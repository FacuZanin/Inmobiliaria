import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

export class PropertyAddressDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  street!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  city!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  postalCode?: string;
}

export class PropertyCoordinatesDto {
  @ApiProperty()
  @IsNumber()
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  longitude!: number;
}

export class PropertyPricingDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;
}

export class PropertyFeaturesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  rooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  coveredArea?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalArea?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  parkingSpaces?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  age?: number;
}

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(180)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ enum: PropiedadTipo })
  @IsEnum(PropiedadTipo)
  type!: PropiedadTipo;

  @ApiProperty({ enum: OperacionTipo })
  @IsEnum(OperacionTipo)
  operationType!: OperacionTipo;

  @ApiProperty({ type: PropertyAddressDto })
  @ValidateNested()
  @Type(() => PropertyAddressDto)
  address!: PropertyAddressDto;

  @ApiPropertyOptional({ type: PropertyCoordinatesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertyCoordinatesDto)
  coordinates?: PropertyCoordinatesDto;

  @ApiPropertyOptional({ type: PropertyPricingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertyPricingDto)
  pricing?: PropertyPricingDto;

  @ApiPropertyOptional({ type: PropertyFeaturesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertyFeaturesDto)
  features?: PropertyFeaturesDto;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}
