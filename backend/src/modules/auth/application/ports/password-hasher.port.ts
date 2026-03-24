// backend\src\modules\auth\application\ports\password-hasher.port.ts
export interface PasswordHasherPort {
  hash(raw: string): Promise<string>;
  compare(raw: string, hashed: string): Promise<boolean>;
}
