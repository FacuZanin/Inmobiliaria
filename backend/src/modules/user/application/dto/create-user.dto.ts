// backend\src\modules\user\application\dto\create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsString,
  Validate,
} from 'class-validator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

import { IsPositiveInteger } from '../../../../shared/utils/validators/is-positive-integer.validator';
import { IsNonEmptyString } from '../../../../shared/utils/validators/is-non-empty-string.validator';


export class CreateUserDto {
  @IsNonEmptyString()
  @IsString()
  nombre: string;

  @IsNonEmptyString()
  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsPositiveInteger()
  agenciaId?: number;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsEnum(UserProfile)
  profile: UserProfile;
}
