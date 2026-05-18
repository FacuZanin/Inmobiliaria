// backend\src\modules\user\domain\capabilities\property-publishers.ts
import { UserType } from '@shared/contracts/enums/user-type.enum';

export const PROPERTY_PUBLISHERS: UserType[] = [
  UserType.PARTICULAR,

  UserType.INMOBILIARIA,
  UserType.CORREDOR,
  UserType.MARTILLERO,
  UserType.BROKER,

  UserType.DESARROLLADOR,
  UserType.CONSTRUCTOR,
];