// backend\src\modules\auth\domain\value-objects\password.vo.ts
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

export class Password {
  private constructor(private readonly _value: string) {}

  static async create(
    plainPassword: string,
    hasher: PasswordHasherPort,
  ): Promise<Password> {
    if (!plainPassword || plainPassword.length < 8) {
      throw new Error('La contraseña no cumple con los requisitos mínimos');
    }

    const hashed = await hasher.hash(plainPassword);
    return new Password(hashed);
  }

  get value(): string {
    return this._value;
  }
}
