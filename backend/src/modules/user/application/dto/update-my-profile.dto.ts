// backend\src\modules\user\application\dto\update-my-profile.dto.ts
import { IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMyProfileDto {
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
    example: '1122334455',
  })
  @IsOptional()
  @IsString()
  telefono?: string;
}