// backend\src\modules\admin-documentos\domain\value-objects\documento-id.vo.ts
export class DocumentoIdVO {
  constructor(public readonly value: number) {
    if (!value || value <= 0) {
      throw new Error('DocumentoId inválido');
    }
  }
}
