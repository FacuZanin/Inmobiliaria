// backend\src\modules\listings\application\dto\moderation.dto.ts
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { ModerationStatus } from '../../domain/enums/moderation-status.enum';

export class ModerateListingDto {
  @ApiProperty({
    enum: ModerationStatus,
  })
  @IsEnum(ModerationStatus)
  status!: ModerationStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}