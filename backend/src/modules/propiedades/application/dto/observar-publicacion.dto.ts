// backend/src/modules/propiedades/application/dto/observar-publicacion.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ObservarPublicacionDto {
  @ApiPropertyOptional({
    example: 'Faltan fotos de fachada y escritura adjunta.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  motivo?: string;
}
