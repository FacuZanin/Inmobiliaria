// backend\src\modules\auth\infrastructure\services\password-hasher.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

@Injectable()
export class PasswordHasherService implements PasswordHasherPort {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}