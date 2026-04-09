import {
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsString,
} from 'class-validator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsEnum(UserProfile)
  profile?: UserProfile | null;

  @IsOptional()
  @IsString()
  nombre?: string;

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