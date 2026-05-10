// backend\src\modules\user\application\dto\update-user-admin.dto.ts
import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

export class UpdateUserAdminDto {
  @ApiPropertyOptional({
    example: 'Facundo',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: 'Zanin',
  })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    enum: UserType,
    example: UserType.USER,
  })
  @IsOptional()
  @IsEnum(UserType)
  tipo?: UserType;

  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}