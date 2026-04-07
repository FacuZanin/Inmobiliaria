// backend\src\common\validators\ensure-not-empty.ts
import { BadRequestException } from '@nestjs/common';

export function ensureNotEmpty<T extends object>(
  dto: T,
  message = 'No hay datos para actualizar',
): void {
  if (!dto || Object.keys(dto).length === 0) {
    throw new BadRequestException(message);
  }
}
