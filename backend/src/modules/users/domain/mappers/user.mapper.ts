// backend\src\modules\user\domain\mappers\user.mapper.ts
import { User } from '../entities/user.entity';
import { UserId } from '../../../auth/domain/value-objects/user-id.vo';

export class UserMapper {
  static toDomain(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      nombre: user.nombre,
      apellido: user.apellido,
      tokenVersion: user.tokenVersion,
    };
  }
}
