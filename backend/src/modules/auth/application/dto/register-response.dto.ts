// backend\src\modules\auth\application\dto\register-response.dto.ts
import { UserRole } from '@shared/enums/user-role.enum';
import { UserProfile } from '@shared/enums/user-profile.enum';

export class RegisterResponseDto {
  id: number;
  email: string;
  role: UserRole;
  profile: UserProfile;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
}
