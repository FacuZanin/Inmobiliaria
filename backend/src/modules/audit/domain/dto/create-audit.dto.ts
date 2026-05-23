// backend\src\modules\audit\domain\dto\create-audit.dto.ts
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuditDto {
  @ApiProperty()
  @IsString()
  action!: string;

  @ApiProperty()
  @IsString()
  entity!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  entityId?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  oldValue?: Record<string, any> | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  newValue?: Record<string, any> | null;
}