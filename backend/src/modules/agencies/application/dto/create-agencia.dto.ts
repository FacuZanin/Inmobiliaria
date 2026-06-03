// backend/src/modules/agencias/application/dto/create-agencia.dto.ts

import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateAgenciaDto {
  @ApiProperty({
    example: 'Zanin Propiedades',
  })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({
    example: 'Av. Libertador 1234',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  direccion!: string | null;

  @ApiPropertyOptional({
    example: 'Tigre',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  localidad!: string | null;

  @ApiPropertyOptional({
    example: 'contacto@zaninpropiedades.com',
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email!: string | null;

  @ApiPropertyOptional({
    example: '1122334455',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'https://placehold.co/300x300/png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}