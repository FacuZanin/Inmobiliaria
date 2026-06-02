// backend\src\common\validators\ensure-not-empty.ts
import { DomainException } from '@/shared/domain/exceptions/domain.exception';

export function ensureNotEmpty<T extends object>(
  dto: T,
  message = 'No hay datos para actualizar',
): void {
  if (!dto || Object.keys(dto).length === 0) {
    throw new DomainException(message);
  }
}
