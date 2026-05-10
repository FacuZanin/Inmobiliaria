// backend\src\modules\auth\application\dto\register-to-user.dto.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

export class RegisterToUserDto {
  nombre!: string;
  apellido!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  profile!: UserType;
  status!: UserStatus;
  agenciaId?: number;
}
