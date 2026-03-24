// backend\src\modules\propiedades\application\dto\update-property.dto.ts
export interface UpdatePropertyDTO {
  titulo?: string;
  descripcion?: string;
  operacion?: string;
  precioVenta?: number;
  precioAlquiler?: number;
  direccion?: string;
  localidad?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  metrosCubiertos?: number;
  metrosTotales?: number;
  imagenes?: string[];
  agenciaId?: number | null;
  detalles?: Record<string, any>;
}
