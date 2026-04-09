// backend\src\modules\user\application\dto\complete-profile.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

export class CompleteProfileDto {
  @IsEnum(UserProfile)
  profile!: UserProfile;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  // solo si es agencia
  @IsOptional()
  @IsString()
  agenciaNombre?: string;
}