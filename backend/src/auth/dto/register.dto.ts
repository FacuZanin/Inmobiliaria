import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(['ADMIN', 'AGENCIA', 'EMPLEADO', 'PROPIETARIO', 'INQUILINO'])
  role: UserRole;

  @IsOptional()
  agenciaId?: number;
}
