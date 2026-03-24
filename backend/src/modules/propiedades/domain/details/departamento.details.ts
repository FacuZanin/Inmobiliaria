// backend\src\modules\propiedades\domain\details\departamento.details.ts
export class DepartamentoDetails {
  constructor(
    readonly piso?: number | null,
    readonly unidad?: string | null,
    readonly ascensor?: boolean,
    readonly expensas?: number | null,
    readonly superficieBalcon?: number | null,
    readonly cochera?: boolean,
  ) {}
}
