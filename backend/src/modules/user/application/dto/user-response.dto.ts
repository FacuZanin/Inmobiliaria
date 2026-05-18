// backend\src\modules\user\application\dto\user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';
import { SubscriptionPlan } from '@shared/contracts/enums/subscription-plan.enum';

export class UserResponseDto {
  @ApiProperty({
  })
  id!: number;

  @ApiProperty({
  })
  email!: string;

  @ApiProperty({
    enum: UserRole,
  })
  role!: UserRole;

  @ApiProperty({
    enum: UserType,
  })
  tipo!: UserType;

  @ApiProperty({
    nullable: true,
  })
  nombre!: string | null;

  @ApiProperty({
    nullable: true,
  })
  apellido!: string | null;

  @ApiProperty({
    nullable: true,
  })
  telefono!: string | null;

  @ApiProperty({
    nullable: true,
  })
  avatarUrl!: string | null;

  @ApiProperty({
    enum: UserStatus,
  })
  status!: UserStatus;

  plan!: SubscriptionPlan;
}