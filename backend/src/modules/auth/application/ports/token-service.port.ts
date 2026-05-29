// backend\src\modules\auth\application\ports\token-service.port.ts
export interface TokenServicePort {
  sign(payload: any): Promise<string>;
  signRefresh(payload: { sub: number; tokenVersion: number }): Promise<string>;
  verifyRefresh(token: string): Promise<{ sub: number; tokenVersion: number }>;
}

