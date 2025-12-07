import { IsEnum, IsOptional } from 'class-validator';

export class ExportarDocumentosDto {
  @IsEnum(['csv', 'pdf'])
  formato: 'csv' | 'pdf';

  @IsOptional()
  filters?: any; // reutilizamos FiltroDocumentosDto internamente
}
