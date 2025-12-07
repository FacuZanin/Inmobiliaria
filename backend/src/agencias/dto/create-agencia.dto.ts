import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateAgenciaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  localidad: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
