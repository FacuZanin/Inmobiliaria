import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOperationDto {
  @ValidateIf((dto) => dto.propertyId === undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  listingId?: number;

  @ValidateIf((dto) => dto.listingId === undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  propertyId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
