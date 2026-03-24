// backend\src\modules\propiedades\domain\details\ph.details.ts
export class PHDetails {
  constructor(
    readonly porcentajeLote?: number | null,
    readonly entradaIndividual?: boolean,
    readonly patio?: boolean,
    readonly expensas?: number | null,
  ) {}
}
