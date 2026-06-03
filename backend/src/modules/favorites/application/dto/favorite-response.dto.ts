//backend\src\modules\favoritos\application\dto\favorite-response.dto.ts

export class FavoriteResponseDto {
  id!: number;

  propertyId!: number;

  createdAt!: Date;

  property!: {
    id: number;
    titulo: string;
    precio: number;
    moneda: string;
    ciudad?: string;
    provincia?: string;
    imagenPrincipal?: string | null;
  };
}