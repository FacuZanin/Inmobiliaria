// backend\src\modules\propiedades\domain\details\campo.details.ts
export type CampoApto =
  | 'GANADERIA'
  | 'AGRICULTURA'
  | 'MIXTO'
  | 'OTRO';

export class CampoDetails {
  constructor(
    readonly hectareas?: number | null,
    readonly apto?: CampoApto | null,
    readonly mejoras?: string | null,
  ) {}
}
