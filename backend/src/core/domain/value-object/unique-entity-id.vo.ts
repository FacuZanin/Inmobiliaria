// backend/src/core/domain/value-object/unique-entity-id.vo.ts
import { randomUUID } from 'crypto';
import { Result } from '../../shared-kernel/result/result';
import { ValueObject } from './value-object.base';

export class UniqueEntityId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  static create(id?: string): Result<UniqueEntityId> {
    const value = id ?? randomUUID();
    return Result.ok(new UniqueEntityId(value));
  }

  get value(): string {
    return this.props.value;
  }

  equals(other?: UniqueEntityId): boolean {
    if (!other) return false;
    return this.props.value === other.props.value;
  }
}
