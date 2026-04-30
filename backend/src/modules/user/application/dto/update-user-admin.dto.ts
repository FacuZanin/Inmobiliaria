// backend\src\modules\user\application\dto\update-user-admin.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserType)
  tipo?: UserType;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
