// backend\src\modules\agencias\application\dto\create-solicitud-agencia.dto.ts
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSolicitudAgenciaDto {
  @IsString()
  @IsNotEmpty()
  nombreTitular!: string;

  @IsString()
  @IsNotEmpty()
  dni!: string;

  @IsString()
  @IsNotEmpty()
  cuit!: string;

  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @IsString()
  @IsNotEmpty()
  colegio!: string;

  @IsString()
  @IsNotEmpty()
  provincia!: string;

  @IsUrl()
  dniFrente!: string;

  @IsUrl()
  dniDorso!: string;

  @IsUrl()
  constanciaCuit!: string;

  @IsUrl()
  constanciaAfip!: string;

  @IsUrl()
  certificadoMatricula!: string;

  @IsUrl()
  carnetProfesional!: string;
}
