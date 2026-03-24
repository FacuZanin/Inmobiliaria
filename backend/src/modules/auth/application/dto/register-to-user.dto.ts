// backend\src\modules\auth\application\dto\register-to-user.dto.ts
import { UserRole, UserProfile, UserStatus } from '@shared/contracts';

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