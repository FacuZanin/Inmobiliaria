// backend\src\modules\auth\domain\value-objects\password.vo.ts
import { ValidationError } from '@/core/shared-kernel/errors/validation.error';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

export class Password {
  private constructor(private readonly _value: string) {}

  static async create(
    plainPassword: string,
    hasher: PasswordHasherPort,
  ): Promise<Password> {
    if (!plainPassword) {
      throw new ValidationError('La contraseña es requerida');
    }

    if (plainPassword.length < 8) {
      throw new ValidationError(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }

    if (!/[A-Z]/.test(plainPassword)) {
      throw new ValidationError(
        'La contraseña debe tener al menos una mayúscula',
      );
    }

    if (!/[0-9]/.test(plainPassword)) {
      throw new ValidationError('La contraseña debe tener al menos un número');
    }

    const hashed = await hasher.hash(plainPassword);
    return new Password(hashed);
  }

  get value(): string {
    return this._value;
  }
}
