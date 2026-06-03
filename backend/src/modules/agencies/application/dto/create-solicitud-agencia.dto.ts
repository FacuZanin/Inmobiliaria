// backend/src/modules/agencias/application/dto/create-solicitud-agencia.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsUrl,
  Length,
  Matches,
  IsEnum,
  IsIn,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { PROFESSIONAL_USER_TYPES } from '@/modules/users/domain/capabilities/property-publishers';

export class CreateSolicitudAgenciaDto {
  @ApiProperty({
    enum: UserType,
    enumName: 'UserType',
    example: UserType.CORREDOR,
    description: 'Perfil profesional que el usuario solicita activar',
    required: true,
  })
  @IsEnum(UserType)
  @IsIn(PROFESSIONAL_USER_TYPES, {
    message: 'El tipo solicitado debe ser un perfil profesional valido',
  })
  tipoSolicitado!: UserType;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre completo del titular o profesional solicitante',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombreTitular!: string;

  @ApiProperty({
    example: '30123456',
    description: 'Documento nacional de identidad del titular',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(7, 10)
  @Matches(/^[0-9]+$/, {
    message: 'El DNI solo debe contener numeros',
  })
  dni!: string;

  @ApiProperty({
    example: '20-30123456-7',
    description: 'CUIT del titular o empresa',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{8}-\d$/, {
    message: 'Formato de CUIT invalido',
  })
  cuit!: string;

  @ApiProperty({
    example: 'MAT-458721',
    description: 'Numero de matricula profesional o registro equivalente',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @ApiProperty({
    example: 'Colegio Profesional Inmobiliario CABA',
    description: 'Colegio, entidad profesional o registro al que pertenece',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  colegio!: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Provincia donde opera',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  provincia!: string;

  @ApiProperty({
    example: 'https://storage.com/dni-frente.jpg',
    description: 'URL de la foto frontal del DNI',
    required: true,
  })
  @IsUrl()
  dniFrente!: string;

  @ApiProperty({
    example: 'https://storage.com/dni-dorso.jpg',
    description: 'URL de la foto trasera del DNI',
    required: true,
  })
  @IsUrl()
  dniDorso!: string;

  @ApiProperty({
    example: 'https://storage.com/constancia-cuit.pdf',
    description: 'URL de la constancia de CUIT',
    required: true,
  })
  @IsUrl()
  constanciaCuit!: string;

  @ApiProperty({
    example: 'https://storage.com/constancia-afip.pdf',
    description: 'URL de la constancia de AFIP',
    required: true,
  })
  @IsUrl()
  constanciaAfip!: string;

  @ApiProperty({
    example: 'https://storage.com/certificado-matricula.pdf',
    description: 'URL del certificado de matricula',
    required: true,
  })
  @IsUrl()
  certificadoMatricula!: string;

  @ApiProperty({
    example: 'https://storage.com/carnet-profesional.jpg',
    description: 'URL del carnet profesional',
    required: true,
  })
  @IsUrl()
  carnetProfesional!: string;
}
