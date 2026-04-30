// backend\src\modules\user\application\dto\user-response.dto.ts
import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';

export class UserResponseDto {
  id!: number;
  email!: string;
  role!: UserRole;
  tipo!: UserType;
  nombre!: string | null;
  apellido!: string | null;
  telefono!: string | null;
}
