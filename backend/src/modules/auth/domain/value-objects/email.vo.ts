// backend\src\modules\auth\domain\value-objects\email.vo.ts
export class Email {
  private constructor(private readonly _value: string) {}

  static create(email: string): Email {
    if (!email) {
      throw new Error('Email requerido');
    }

    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error('Formato de email inválido');
    }

    return new Email(normalized);
  }

  get value(): string {
    return this._value;
  }
}
