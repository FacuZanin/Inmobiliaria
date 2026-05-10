import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'facundo@test.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'facundo@test.com',
    description: 'Confirmación del email',
  })
  @IsEmail()
  @IsNotEmpty()
  repeatEmail!: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Debe contener al menos una mayúscula y un número',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe tener al menos una mayúscula y un número',
  })
  password!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Confirmación de contraseña',
  })
  @IsNotEmpty()
  @MinLength(8)
  repeatPassword!: string;

  @ApiProperty({
    example: 'Facundo',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Zanin',
    description: 'Apellido del usuario',
  })
  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @ApiProperty({
    example: '1122334455',
    description: 'Teléfono del usuario',
  })
  @IsString()
  @IsNotEmpty()
  telefono!: string;
}