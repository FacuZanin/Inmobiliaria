// backend\src\modules\user\application\dto\user-response.dto.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

export class UserResponseDto {
  id: number;
  email: string;
  role: UserRole;
  profile: UserProfile;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
}
