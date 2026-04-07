// backend\src\modules\auth\application\dto\register-to-user.dto.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

export class RegisterToUserDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
  status: UserStatus;
  agenciaId?: number;
}
