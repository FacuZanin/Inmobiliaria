// backend\src\modules\auth\application\dto\register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test123@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'test123@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  repeatEmail!: string;

  @ApiProperty({
    example: 'Password123',
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número',
  })
  password!: string;

  @ApiProperty({
    example: 'Password123',
  })
  @IsNotEmpty()
  @MinLength(8)
  repeatPassword!: string;

  @ApiProperty({
    example: 'Facundo',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Zanin',
  })
  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @ApiProperty({
    example: '1122334455',
  })
  @IsString()
  @IsNotEmpty()
  telefono!: string;
}