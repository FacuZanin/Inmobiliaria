// backend\src\modules\auth\application\dto\register.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsOptional,
  ValidateIf,
  Matches,
  IsString
} from 'class-validator';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

export class RegisterDto {
  @IsNotEmpty()
  nombre!: string;

  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Debe tener al menos una mayúscula y un número',
  })
  password!: string;

  @IsNotEmpty()
  @IsEnum(UserProfile)
  profile!: UserProfile;

  @ValidateIf((o) => o.profile === UserProfile.AGENCIA)
  @IsNotEmpty()
  @IsString()
  nombreAgencia?: string;
}
