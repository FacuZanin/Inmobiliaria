// backend/src/modules/listings/application/dto/publish-listing.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PublishListingDto {
  @ApiPropertyOptional({
    description:
      'Optional note left by the owner when requesting publication.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
