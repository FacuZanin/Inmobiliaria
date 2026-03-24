// backend\src\modules\inquilinos\application\ports\inquilinos-repository.port.ts
import type { Inquilino } from '../../domain/entities/inquilino.entity';

export interface InquilinosRepositoryPort {
  findByUserId(userId: number): Promise<Inquilino | null>;
  save(inquilino: Inquilino): Promise<Inquilino>;
}
