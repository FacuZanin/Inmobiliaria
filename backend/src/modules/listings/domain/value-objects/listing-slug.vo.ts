// backend\src\modules\listings\domain\value-objects\listing-slug.vo.ts
export class ListingSlug {
  private readonly value: string;

  constructor(value: string) {
    this.value = this.normalize(value);

    this.validate(this.value);
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('ListingSlug must be a valid string');
    }

    if (value.length < 3) {
      throw new Error('ListingSlug must contain at least 3 characters');
    }

    if (value.length > 200) {
      throw new Error('ListingSlug exceeds maximum length');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}