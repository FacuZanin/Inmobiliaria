import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class ReorderListingMediaItemDto {
  @IsInt()
  @Min(1)
  id!: number;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ReorderListingMediaDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderListingMediaItemDto)
  items!: ReorderListingMediaItemDto[];
}
