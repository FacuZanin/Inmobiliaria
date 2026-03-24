// backend\src\modules\admin-documentos\application\dto\exportar-documentos.dto.ts
import { IsEnum, IsOptional } from 'class-validator';

export class ExportarDocumentosDto {
  @IsEnum(['csv', 'pdf'])
  formato: 'csv' | 'pdf';

  @IsOptional()
  filters?: any;
}
