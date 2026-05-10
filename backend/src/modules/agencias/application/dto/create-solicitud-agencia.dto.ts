// backend/src/modules/agencias/application/dto/create-solicitud-agencia.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateSolicitudAgenciaDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del titular de la inmobiliaria',
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
    message: 'El DNI solo debe contener números',
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
    message: 'Formato de CUIT inválido',
  })
  cuit!: string;

  @ApiProperty({
    example: 'MAT-458721',
    description: 'Número de matrícula profesional',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @ApiProperty({
    example: 'Colegio Profesional Inmobiliario CABA',
    description: 'Colegio profesional al que pertenece',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  colegio!: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Provincia donde opera la agencia',
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
    description: 'URL del certificado de matrícula',
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