import { SetMetadata } from '@nestjs/common';
import { UserType } from '@shared/contracts/enums/user-type.enum';

export const USER_TYPE_KEY = 'user_type';

export const UserTypes = (...types: UserType[]) =>
  SetMetadata(USER_TYPE_KEY, types);