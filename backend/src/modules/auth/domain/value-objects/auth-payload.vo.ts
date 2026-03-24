// backend\src\modules\auth\domain\value-objects\auth-payload.vo.ts
export class AuthPayload {
  constructor(
    public readonly userId: number,
    public readonly role: string,
    public readonly profile: string,
    public readonly tokenVersion: number,
  ) {}

  static create(params: {
    userId: number;
    role: string;
    profile: string;
    tokenVersion: number;
  }) {
    return new AuthPayload(
      params.userId,
      params.role,
      params.profile,
      params.tokenVersion,
    );
  }
}
