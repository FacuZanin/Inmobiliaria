// backend\src\modules\user\application\dto\update-user-admin.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';
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
  @IsEnum(UserProfile)
  profile?: UserProfile;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
