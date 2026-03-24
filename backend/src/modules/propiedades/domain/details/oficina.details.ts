// backend\src\modules\propiedades\domain\details\oficina.details.ts
export class OficinaDetails {
  constructor(
    readonly puestos?: number | null,
    readonly salaReuniones?: boolean,
    readonly kitchenette?: boolean,
    readonly banos?: number | null,
    readonly expensas?: number | null,
  ) {}
}
