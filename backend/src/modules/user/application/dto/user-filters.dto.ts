// backend\src\modules\user\application\dto\user-filters.dto.ts
import { IsOptional, IsBoolean, IsEnum, IsString, IsDateString } from 'class-validator';
import { UserRole } from '@shared/enums/user-role.enum';

export class UserFiltersDto {
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @IsOptional()
  orderBy?: 'createdAt' | 'email';

  @IsOptional()
  order?: 'ASC' | 'DESC';
}
