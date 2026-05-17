// backend\src\modules\user\application\dto\create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsString,
  Matches,
  IsNumber,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@test.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 8,
  })
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiPropertyOptional({
    enum: UserType,
    example: UserType.PARTICULAR,
  })
  @IsOptional()
  @IsEnum(UserType)
  tipo?: UserType;

  @ApiPropertyOptional({
    example: 'Facundo',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: 'Zanin',
  })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({
    example: '1122334455',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  agenciaId?: number;
}