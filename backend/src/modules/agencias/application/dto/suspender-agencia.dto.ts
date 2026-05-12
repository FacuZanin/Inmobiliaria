import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SuspenderAgenciaDto {
  @ApiProperty({
    example: 'Incumplimiento de políticas',
  })
  @IsString()
  @IsNotEmpty()
  motivo!: string;
}