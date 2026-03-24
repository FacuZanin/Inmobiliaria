// backend\src\modules\propiedades\domain\details\local.details.ts
export class LocalDetails {
  constructor(
    readonly vidrieraMetros?: number | null,
    readonly deposito?: boolean,
    readonly banos?: number | null,
    readonly aptoGastronomico?: boolean,
    readonly luzTrifasica?: boolean,
  ) {}
}
