// backend/src/modules/propiedades/domain/value-objects/price.vo.ts
export class PriceVO {
  readonly value: number;

  constructor(value: number) {
    if (value != null && (typeof value !== 'number' || Number.isNaN(value) || value < 0)) {
      throw new Error('Precio inválido');
    }
    this.value = value;
  }

  static fromNumber(n?: number | null) {
    return n == null ? null : new PriceVO(n);
  }
}
