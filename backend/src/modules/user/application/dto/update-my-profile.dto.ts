// backend\src\modules\user\application\dto\update-my-profile.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
