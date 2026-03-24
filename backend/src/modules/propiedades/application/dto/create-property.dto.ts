// backend\src\modules\propiedades\application\dto\create-property.dto.ts
export interface CreatePropertyDTO {
  titulo: string;
  descripcion?: string;
  tipo: string;
  operacion: string;
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
  propietarioId?: number;
  agenciaId?: number | null;
  detalles?: Record<string, any>;
}
