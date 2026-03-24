// backend\src\modules\propiedades\domain\value-objects\address.vo.ts
export class AddressVO {
  readonly calle: string;
  readonly numero?: string;

  constructor(calle: string, numero?: string) {
    if (!calle || calle.trim().length === 0) throw new Error('Calle inválida');
    this.calle = calle.trim();
    this.numero = numero ? String(numero) : undefined;
  }

  static fromPlain(p: { calle: string; numero?: string }) {
    return new AddressVO(p.calle, p.numero);
  }

  toString() {
    return this.numero ? `${this.calle} ${this.numero}` : this.calle;
  }
}
