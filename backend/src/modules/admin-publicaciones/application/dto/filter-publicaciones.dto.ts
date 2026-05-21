// backend\src\modules\admin-publicaciones\application\dto\filter-publicaciones.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

export class FilterPublicacionesDto {
  @ApiPropertyOptional({
    enum: PublicacionStatus,
  })
  @IsOptional()
  @IsEnum(PublicacionStatus)
  status?: PublicacionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}