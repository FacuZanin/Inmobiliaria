// backend\src\modules\inquilinos\application\dto\agregar-favorito.dto.ts
import { IsInt } from 'class-validator';

export class AgregarFavoritoDTO {
  @IsInt()
  propiedadId: number;
}
