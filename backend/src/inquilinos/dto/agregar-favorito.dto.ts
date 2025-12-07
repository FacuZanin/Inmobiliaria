import { IsInt } from 'class-validator';

export class AgregarFavoritoDto {
  @IsInt()
  propiedadId: number;
}
