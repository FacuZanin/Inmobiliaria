// backend\src\modules\user\application\dto\user-response.dto.ts
import { UserRole, UserProfile } from '@shared/contracts';

export class UserResponseDto {
  id: number;
  email: string;
  role: UserRole;
  profile: UserProfile;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
}
