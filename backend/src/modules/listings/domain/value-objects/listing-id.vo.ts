// backend\src\modules\listings\domain\value-objects\listing-id.vo.ts
import { randomUUID } from 'crypto';

export class ListingId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();

    this.validate(this.value);
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('ListingId must be a valid string');
    }

    if (value.trim().length < 10) {
      throw new Error('ListingId is invalid');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ListingId): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value;
  }
}