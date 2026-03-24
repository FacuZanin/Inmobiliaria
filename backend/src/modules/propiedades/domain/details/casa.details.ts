// backend\src\modules\propiedades\domain\details\casa.details.ts
export class CasaDetails {
  constructor(
    readonly antiguedad?: number | null,
    readonly garage?: boolean,
    readonly patio?: boolean,
    readonly quincho?: boolean,
    readonly pileta?: boolean,
    readonly superficieTerreno?: number | null,
    readonly superficieConstruida?: number | null,
  ) {}
}
