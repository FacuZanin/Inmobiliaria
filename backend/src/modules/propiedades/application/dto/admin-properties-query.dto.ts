// backend\src\modules\propiedades\application\dto\admin-properties-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaginationQueryDto } from '@/shared/application/dto/pagination-query.dto';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';
import { OrderEnum } from '@shared/contracts/enums/order.enum';
import { PropertyAdminSortBy } from '@shared/contracts/enums/property-admin-sort-by.enum';

export class AdminPropertiesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: PublicacionStatus,
    description: 'Estado de moderación',
  })
  @IsOptional()
  @IsEnum(PublicacionStatus)
  status?: PublicacionStatus;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Campo de ordenamiento',
  })
  @IsOptional()
  @IsEnum(PropertyAdminSortBy)
  sortBy?: PropertyAdminSortBy = PropertyAdminSortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: OrderEnum,
    example: OrderEnum.DESC,
    description: 'Orden ASC o DESC',
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  order?: OrderEnum = OrderEnum.DESC;

  @ApiPropertyOptional({
    example: 'departamento palermo',
    description: 'Búsqueda textual',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Fecha desde',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Fecha hasta',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID de agencia',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  agencyId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Publicaciones verificadas',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  verified?: boolean;
}
