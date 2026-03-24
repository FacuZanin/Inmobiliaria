// backend\src\modules\propietario-documentos\domain\entities\owner.ts
export class Owner {
  constructor(
    public id: number,
    public nombre?: string | null,
    public email?: string | null,
  ) {}
}
