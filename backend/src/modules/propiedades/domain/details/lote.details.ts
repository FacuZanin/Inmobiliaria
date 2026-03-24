// backend\src\modules\propiedades\domain\details\lote.details.ts
export class LoteDetails {
  constructor(
    readonly superficieTotal?: number | null,
    readonly frente?: number | null,
    readonly fondo?: number | null,
    readonly zonificacion?: string | null,
  ) {}
}
