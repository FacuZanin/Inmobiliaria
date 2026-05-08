// backend\src\modules\agencias\application\dto\create-agencia.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgenciaDto {
  @ApiProperty({
    example: 'Zanin Propiedades',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Av. Libertador 1234',
  })
  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @ApiProperty({
    example: 'Tigre',
  })
  @IsString()
  @IsNotEmpty()
  localidad!: string;

  @ApiProperty({
    example: 'contacto@zaninpropiedades.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({
    example: '1122334455',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'https://placehold.co/300x300/png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}