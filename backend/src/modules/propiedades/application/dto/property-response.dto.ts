// backend\src\modules\propiedades\application\dto\property-response.dto.ts
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

export class PropertyResponseDto {
  @ApiProperty()
  id!: number | null;

  @ApiProperty()
  titulo!: string;

  @ApiPropertyOptional()
  descripcion?: string | null;

  @ApiProperty({
    enum: PropiedadTipo,
  })
  tipo!: PropiedadTipo;

  @ApiProperty({
    enum: OperacionTipo,
  })
  operacion!: OperacionTipo;

  @ApiPropertyOptional()
  precio?: number | null;

  @ApiPropertyOptional()
  direccion?: string | null;

  @ApiPropertyOptional()
  localidad?: string | null

  @ApiPropertyOptional()
  ambientes?: number | null;

  @ApiPropertyOptional()
  dormitorios?: number | null;

  @ApiPropertyOptional()
  banos?: number | null;

  @ApiPropertyOptional()
  metrosCubiertos?: number | null;

  @ApiPropertyOptional()
  metrosTotales?: number | null;

  @ApiPropertyOptional({
    type: [String],
  })
  imagenes?: string[];

  @ApiPropertyOptional()
  agenciaId?: number | null;

  @ApiProperty()
  creadoPorId!: number | null

  @ApiProperty()
  activo!: boolean;

  @ApiProperty()
  creadoEn?: Date;

  @ApiPropertyOptional({
    type: Object,
  })
  detalles?: Record<string, any>;
}