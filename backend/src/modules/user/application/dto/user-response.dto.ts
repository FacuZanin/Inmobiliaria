// backend\src\modules\user\application\dto\user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
  })
  id!: number;

  @ApiProperty({
    example: 'usuario@test.com',
  })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  role!: UserRole;

  @ApiProperty({
    enum: UserType,
    example: UserType.PARTICULAR,
  })
  tipo!: UserType;

  @ApiProperty({
    example: 'Facundo',
    nullable: true,
  })
  nombre!: string | null;

  @ApiProperty({
    example: 'Zanin',
    nullable: true,
  })
  apellido!: string | null;

  @ApiProperty({
    example: '1122334455',
    nullable: true,
  })
  telefono!: string | null;

  @ApiProperty({
    example: 'https://cdn.midominio.com/avatar.jpg',
    nullable: true,
  })
  avatarUrl!: string | null;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status!: UserStatus;
}