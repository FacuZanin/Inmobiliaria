// backend\src\shared\security\types\request-with-user.type.ts
import { Request } from 'express';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}