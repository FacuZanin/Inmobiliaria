// backend\src\modules\listings\domain\value-objects\money.vo.ts

export class ListingMoneyVO {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency = 'USD') {
    this.validate(amount, currency);

    this.amount = amount;
    this.currency = currency.toUpperCase();
  }

  private validate(amount: number, currency: string): void {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      throw new Error('Money amount must be a valid number');
    }

    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    if (!currency || typeof currency !== 'string') {
      throw new Error('Money currency is invalid');
    }

    if (currency.trim().length !== 3) {
      throw new Error('Money currency must contain 3 characters');
    }
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public add(other: ListingMoneyVO): ListingMoneyVO {
    this.ensureSameCurrency(other);

    return new ListingMoneyVO(this.amount + other.getAmount(), this.currency);
  }

  public subtract(other: ListingMoneyVO): ListingMoneyVO {
    this.ensureSameCurrency(other);

    return new ListingMoneyVO(this.amount - other.getAmount(), this.currency);
  }

  public multiply(multiplier: number): ListingMoneyVO {
    return new ListingMoneyVO(this.amount * multiplier, this.currency);
  }

  public equals(other: ListingMoneyVO): boolean {
    return (
      this.amount === other.getAmount() &&
      this.currency === other.getCurrency()
    );
  }

  private ensureSameCurrency(other: ListingMoneyVO): void {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Currencies do not match');
    }
  }

  public toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
}}