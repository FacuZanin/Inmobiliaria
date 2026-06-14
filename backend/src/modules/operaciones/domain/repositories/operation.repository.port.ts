import { OperationEntity } from '../entities/operation.entity';

export abstract class OperationRepositoryPort {
  abstract save(operation: OperationEntity): Promise<OperationEntity>;
  abstract findById(id: number): Promise<OperationEntity | null>;
  abstract findByBuyer(buyerId: number): Promise<OperationEntity[]>;
  abstract findByOwner(ownerId: number, agencyId?: number | null): Promise<OperationEntity[]>;
}
