import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsString,
  Validate,
} from 'class-validator';

import { UserRole } from '../../../common/enums/user-role.enum';
import { IsPositiveInteger } from '../../../common/validators/is-positive-integer.validator';
import { IsNonEmptyString } from '../../../common/validators/is-non-empty-string.validator';

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
}
