// backend\src\modules\auth\application\dto\register-response.dto.ts
import { UserRole, UserProfile } from '@shared/contracts';

export class RegisterResponseDto {
  id: number;
  email: string;
  role: UserRole;
  profile: UserProfile;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
}
