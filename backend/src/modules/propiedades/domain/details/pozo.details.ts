// backend\src\modules\propiedades\domain\details\pozo.details.ts
export class PozoDetails {
  constructor(
    readonly fechaEntrega?: Date | null,
    readonly avancePorcentaje?: number | null,
    readonly tipologias?: string | null,
    readonly constructora?: string | null,
  ) {}
}
