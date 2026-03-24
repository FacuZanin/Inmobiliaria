// backend\src\modules\auth\domain\value-objects\user-id.vo.ts

export class UserId {
  private constructor(private readonly _value: number) {}

  static create(id: number): UserId {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('UserId inválido');
    }

    return new UserId(id);
  }

  get value(): number {
    return this._value;
  }
}

