// backend\src\modules\auth\domain\value-objects\refresh-token-payload.vo.ts
export class RefreshTokenPayload {
  constructor(
    public readonly userId: number,
    public readonly tokenVersion: number,
  ) {}

  static create(userId: number, tokenVersion: number) {
    return new RefreshTokenPayload(userId, tokenVersion);
  }
}
