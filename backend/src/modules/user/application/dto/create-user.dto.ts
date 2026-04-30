import {
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsString,
} from 'class-validator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
@IsEnum(UserType)
tipo?: UserType;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  agenciaId?: number;
}