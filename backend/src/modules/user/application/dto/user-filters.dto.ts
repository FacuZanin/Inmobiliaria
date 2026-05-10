// backend\src\modules\user\application\dto\user-filters.dto.ts
import {
  IsOptional,
  IsBoolean,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

export class UserFiltersDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Incluir usuarios eliminados',
  })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar usuarios activos',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'facundo',
    description: 'Buscar por email o nombre',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Fecha mínima de creación',
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Fecha máxima de creación',
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiPropertyOptional({
    enum: ['createdAt', 'email'],
    example: 'createdAt',
  })
  @IsOptional()
  orderBy?: 'createdAt' | 'email';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}