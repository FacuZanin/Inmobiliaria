// backend/src/modules/propiedades/domain/value-objects/superficie.vo.ts
export class SuperficieVO {
  readonly metrosCubiertos?: number | null;
  readonly metrosTotales?: number | null;

  constructor(metrosCubiertos?: number | null, metrosTotales?: number | null) {
    if (metrosCubiertos != null && metrosCubiertos < 0) throw new Error('metrosCubiertos inválido');
    if (metrosTotales != null && metrosTotales < 0) throw new Error('metrosTotales inválido');
    this.metrosCubiertos = metrosCubiertos ?? null;
    this.metrosTotales = metrosTotales ?? null;
  }
}
