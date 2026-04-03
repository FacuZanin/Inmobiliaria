// backend\src\modules\admin-documentos\domain\value-objects\documento-tipo.vo.ts
import { DocumentoTipo } from '@shared/enums/documento-tipo.enum';

export class DocumentoTipoVO {
  private constructor(public readonly value: DocumentoTipo) {}

  static INQUILINO = new DocumentoTipoVO(DocumentoTipo.INQUILINO);
  static PROPIETARIO = new DocumentoTipoVO(DocumentoTipo.PROPIETARIO);

  static from(value: DocumentoTipo): DocumentoTipoVO {
    return new DocumentoTipoVO(value);
  }
}
