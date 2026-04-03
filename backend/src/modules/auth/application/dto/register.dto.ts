// backend\src\modules\auth\application\dto\register.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { UserProfile } from '@shared/enums/user-profile.enum';

export class RegisterDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserProfile)
  profile: UserProfile;

  @IsOptional()
  agenciaId?: number;
}
