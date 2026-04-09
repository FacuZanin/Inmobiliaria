// backend\src\modules\auth\application\dto\register-public.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPublicDto {
  @ApiProperty({ example: 'juan@mail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  apellido!: string;
}
